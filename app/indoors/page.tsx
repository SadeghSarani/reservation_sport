'use client'
import React from 'react';
import { Users, Star } from 'lucide-react';

export interface Indoor {
    id: number;
    name: string;
    sport: string;
    icon: string;
    capacity: number;
    price: number;
    rating: number;
    color: string;
}

interface IndoorsPageProps {
    setCurrentPage: (page: string) => void;
    setSelectedIndoor: (indoor: Indoor) => void;
}

const IndoorsPage: React.FC<IndoorsPageProps> = ({ setCurrentPage, setSelectedIndoor }) => {
    const indoors: Indoor[] = [
        { id: 1, name: 'Basketball Court A', sport: 'Basketball', icon: '🏀', capacity: 10, price: 45, rating: 4.8, color: 'from-orange-500 to-red-600' },
        { id: 2, name: 'Volleyball Arena', sport: 'Volleyball', icon: '🏐', capacity: 12, price: 40, rating: 4.9, color: 'from-blue-500 to-cyan-600' },
        { id: 3, name: 'Badminton Hall', sport: 'Badminton', icon: '🏸', capacity: 4, price: 30, rating: 4.7, color: 'from-green-500 to-emerald-600' },
        { id: 4, name: 'Indoor Soccer Field', sport: 'Soccer', icon: '⚽', capacity: 14, price: 60, rating: 5.0, color: 'from-purple-500 to-indigo-600' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-5xl font-black text-gray-900 mb-8">Our Facilities</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {indoors.map(indoor => (
                    <div
                        key={indoor.id}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
                        onClick={() => { setSelectedIndoor(indoor); setCurrentPage('single-indoor'); }}
                    >
                        <div className={`bg-gradient-to-br ${indoor.color} p-8 text-center`}>
                            <div className="text-7xl mb-4">{indoor.icon}</div>
                            <div className="flex items-center justify-center text-white">
                                <Star className="w-5 h-5 fill-current mr-1" />
                                <span className="text-xl font-bold">{indoor.rating}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{indoor.name}</h3>
                            <p className="text-gray-600 mb-4">{indoor.sport}</p>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center text-gray-700">
                                    <Users className="w-5 h-5 mr-2" />
                                    <span className="font-semibold">Up to {indoor.capacity}</span>
                                </div>
                                <div className="text-2xl font-black text-cyan-600">€{indoor.price}/hr</div>
                            </div>
                            <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndoorsPage;
