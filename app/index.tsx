import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from "@/components/Layout";

interface Indoor {
    id: number;
    name: string;
    type: string;
    pricePerHour: number;
}

export default function Indoors() {
    const [indoors, setIndoors] = useState<Indoor[]>([]);
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        // Fetch from backend API
        fetch('/api/indoors' + (typeFilter ? `?type=${typeFilter}` : ''))
            .then(res => res.json())
            .then(setIndoors);
    }, [typeFilter]);

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4">سالن‌ها</h2>

            <div className="mb-4 flex space-x-2">
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">همه</option>
                    <option value="FUTSAL">فوتسال</option>
                    <option value="GYM">باشگاه</option>
                    <option value="TENNIS">تنیس</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {indoors.map(indoor => (
                    <div key={indoor.id} className="bg-white p-4 rounded-xl shadow-md hover:scale-105 transition">
                        <h3 className="text-xl font-bold">{indoor.name}</h3>
                        <p>نوع: {indoor.type}</p>
                        <p>قیمت: {indoor.pricePerHour} تومان / ساعت</p>
                        <Link href={`/app/indoors/${indoor.id}`} className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-lg">
                            رزرو کن
                        </Link>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
