'use client'

import React from 'react';
import {Indoor} from "@/app/indoors/page";


interface SingleIndoorPageProps {
    selectedIndoor: Indoor | null;
    setCurrentPage: (page: string) => void;
}

const SingleIndoorPage: React.FC<SingleIndoorPageProps> = ({ selectedIndoor, setCurrentPage }) => {
    if (!selectedIndoor) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button onClick={() => setCurrentPage('indoors')} className="mb-6 text-cyan-600 font-semibold">← Back</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className={`bg-gradient-to-br ${selectedIndoor.color} rounded-3xl p-12 text-center mb-6`}>
                        <div className="text-9xl mb-6">{selectedIndoor.icon}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-xl">
                        <h1 className="text-4xl font-black text-gray-900 mb-4">{selectedIndoor.name}</h1>
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b">
                                <span className="font-semibold">Sport</span>
                                <span className="font-bold">{selectedIndoor.sport}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b">
                                <span className="font-semibold">Capacity</span>
                                <span className="font-bold">{selectedIndoor.capacity} players</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="font-semibold">Price</span>
                                <span className="text-3xl font-black text-cyan-600">€{selectedIndoor.price}/hr</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-xl h-fit">
                    <h2 className="text-3xl font-black mb-6">Reserve Now</h2>
                    <button onClick={() => setCurrentPage('reserve')} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg">
                        Book This Facility
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleIndoorPage;
