import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Map from '../components/Location/Map.jsx';
import Contents from '../components/Location/Contents.jsx';
import { useRecoilState } from 'recoil';
import { mapsDataState } from '../recoil/mapsState.js'; // Recoil 상태 가져오기

const CreateAndEditPostPage = () => {
  const [startDate, setStartDate] = useState(null); // 시작 날짜 상태
  const [endDate, setEndDate] = useState(null); // 종료 날짜 상태
  const [dateRange, setDateRange] = useState([]); // 선택된 날짜 범위
  const [selectedDate, setSelectedDate] = useState(null); // 현재 선택된 날짜
  const [selectedMarker, setSelectedMarker] = useState(null); // 현재 선택된 마커
  const [mapsData, setMapsData] = useRecoilState(mapsDataState); // Recoil 상태로 관리

  useEffect(() => {
    // Recoil 상태를 콘솔로 확인하여 문제 디버깅
    console.log('현재 mapsData 상태:', mapsData);
  }, [mapsData]);

  const handleDoneClick = () => {
    if (!startDate || !endDate) {
      alert('여행 시작일과 종료일을 선택하세요.');
      return;
    }

    const range = [];
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    const finalDate = new Date(endDate);
    finalDate.setHours(0, 0, 0, 0);

    while (currentDate <= finalDate) {
      range.push(new Date(currentDate).toISOString().split('T')[0]); // YYYY-MM-DD 형식으로 저장
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDateRange(range);
    setSelectedDate(range[0]);

    const initialMapsData = {...mapsData};
    range.forEach((date) => {
      if (!mapsData[date]) {
        initialMapsData[date] = []; // 해당 날짜에 대한 마커 데이터 초기화
      }
    });
    console.log("업데이트된 mapsData (초기화 후):", initialMapsData);
    setMapsData(initialMapsData); // Recoil 상태 업데이트
  };

  // 특정 날짜에 마커를 추가하는 함수
  const handleAddLocation = (date, newLocation) => {
    setMapsData((prevMapsData) => {
      const updatedData = {
        ...prevMapsData,
        [date]: [...(prevMapsData[date] || []), newLocation], // 기존 마커에 새 마커 추가
      };
      console.log('업데이트된 mapsData:', updatedData); // 업데이트된 상태 확인
      return updatedData;
    });
  };

   // 마커 클릭 시 호출되는 함수
   const handleMarkerClick = (marker) => {
    setSelectedMarker(marker); // 선택된 마커를 상태로 저장
  }

    // 콘텐츠 저장 처리 함수
  const handleSaveContent = (content) => {
    if (!selectedMarker) return;

    setMapsData((prevMapsData) => {
      const updatedMarkers = prevMapsData[selectedDate].map((marker) =>
        marker.info === selectedMarker.info ? { ...marker, ...content } : marker
      );

      return {
        ...prevMapsData,
        [selectedDate]: updatedMarkers,
      };
    });

    console.log('콘텐츠 저장 완료:', content);
  };
  
  return (
    <div>
      <h2>Create or Edit Post</h2>

      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        dateFormat="yyyy-MM-dd"
        placeholderText="여행 시작일"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        dateFormat="yyyy-MM-dd"
        placeholderText="여행 종료일"
      />

      <button onClick={handleDoneClick} style={{ marginTop: '10px', padding: '5px' }}>
        Done
      </button>

      {dateRange.length > 0 && (
        <div style={{ display: 'flex', marginTop: '20px', overflowX: 'auto' }}>
          {dateRange.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              style={{
                padding: '10px',
                margin: '0 5px',
                backgroundColor: selectedDate === date ? 'black' : 'lightgrey',
                color: selectedDate === date ? 'white' : 'black',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {new Date(date).toDateString()}
            </button>
          ))}
        </div>
      )}

      {selectedDate && (
        <div style={{ marginTop: '20px' }}>
          <h3>{selectedDate}</h3>
          <Map
            key={selectedDate}
            onAddLocation={(newLocation) => handleAddLocation(selectedDate, newLocation)}
            markers={mapsData[selectedDate]}
            onMarkerClick={handleMarkerClick} // 마커 클릭 시 호출
          />
        </div>
      )}
    {/* 장소 정보 콘텐츠 입력 UI */}
    {selectedMarker && (
        <Contents selectedMarker={selectedMarker} onSaveContent={handleSaveContent} />
      )}
    </div>
  );
};

export default CreateAndEditPostPage;
