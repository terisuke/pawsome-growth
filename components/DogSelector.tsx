
import React from 'react';
import { Dog } from '../types';

interface DogSelectorProps {
  // Fixed: Dog is a type, so we use Dog[] directly instead of typeof Dog[]
  dogs: Dog[];
  activeId: string;
  onSelect: (id: string) => void;
  onAddClick: () => void;
}

export const DogSelector: React.FC<DogSelectorProps> = ({ dogs, activeId, onSelect, onAddClick }) => {
  return (
    <div className="flex items-center space-x-4 overflow-x-auto py-4 px-2 no-scrollbar">
      {dogs.map((dog) => (
        <button
          key={dog.id}
          onClick={() => onSelect(dog.id)}
          className={`flex-shrink-0 flex flex-col items-center transition-all duration-300 transform ${
            activeId === dog.id ? 'scale-110' : 'opacity-60 grayscale-[50%]'
          }`}
        >
          <div className={`w-16 h-16 rounded-full border-4 overflow-hidden shadow-lg ${
            activeId === dog.id ? 'border-amber-200' : 'border-white'
          }`}>
            <img src={dog.image} alt={dog.name} className="w-full h-full object-cover" />
          </div>
          <span className={`text-xs mt-1 font-bold ${activeId === dog.id ? 'text-amber-800' : 'text-gray-500'}`}>
            {dog.name}
          </span>
        </button>
      ))}
      <button 
        onClick={onAddClick}
        className="flex-shrink-0 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity"
      >
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-white">
          <span className="text-2xl text-gray-300">+</span>
        </div>
        <span className="text-xs mt-1 text-gray-500">追加</span>
      </button>
    </div>
  );
};
