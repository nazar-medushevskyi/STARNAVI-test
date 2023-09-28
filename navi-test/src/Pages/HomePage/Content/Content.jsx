import { useState, useEffect } from 'react';
import axios from 'axios';
import './Content.css';

export const Content = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [squaresState, setSquaresState] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [optionsData, setOptionsData] = useState([]);
  const [gridSize, setGridSize] = useState(5);


  useEffect(() => {
    axios.get('https://60816d9073292b0017cdd833.mockapi.io/modes')
      .then((response) => {
        setOptionsData(response.data);
      })
      .catch((error) => {
        console.error('error:', error);
      });
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleStartClick = () => {
    const selectedMode = optionsData.find((mode) => mode.name === selectedOption);
    if (selectedMode && selectedMode.field) {
      setGridSize(selectedMode.field);
      setSquaresState(Array(selectedMode.field * selectedMode.field).fill('white')); // начальное состояние: белый цвет
    }
  };

  const handleSquareHover = (index) => {
    setSquaresState(prevState => {
      const newState = [...prevState];
      newState[index] = newState[index] === 'blue' ? 'white' : 'blue';
      return newState;
    });
  };

  return (
    <>
      <h1>StarNavi: Test task</h1>

      <div className="container">
        <div className="dropdown">
          <div className="dropdown-header" onClick={toggleDropdown}>
            {selectedOption || 'Pick mode'}
            <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
          </div>
          {isOpen && (
            <ul className="dropdown-options">
              {optionsData.map((optionData, index) => (
                <li key={index} onClick={() => handleOptionSelect(optionData.name)}>
                  {optionData.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className='start' onClick={handleStartClick}>Start</button>
      </div>

      <div className="grid">
        {Array(gridSize).fill(0).map((_, rowIndex) => (
          <div className="row" key={rowIndex}>
            {Array(gridSize).fill(0).map((_, colIndex) => {
              const squareIndex = rowIndex * gridSize + colIndex;
              return (
                <div
                  className={`square ${squaresState[squareIndex] === 'blue' ? 'blue' : ''}`}
                  key={colIndex}
                  onMouseEnter={() => handleSquareHover(squareIndex)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};
