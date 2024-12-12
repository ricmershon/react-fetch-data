"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        }
    }
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string
        bs: string;
    }
}

type Users = Array<User>;

export default function Home() {
    const [data, setData] = useState([{}] as Users);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    let filteredData = [{}] as Users;

    if (data.length > 1) {
        filteredData = data.filter((item) => item.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase()))
    }

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        // Add a delay to show loading spinner.
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const result = await response.json();
            setData(result.slice(0, 5));    // Just the first 5 records
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6">API Data Fetching</h1>

                {isLoading && (
                    <div className="flex items-center justify-center space-x-2 mb-3">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading...</span>
                    </div>
                )}

                <input
                    type="text"
                    className="block w-full px-4 py-2 mb-4 border rounded"
                    placeholder="Type a search term"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    disabled={isLoading}
                />

                {data.length > 1 && (
                    <ul className="space-y-4">
                        {filteredData.length > 0 && filteredData.map((item) => (
                            <li
                                key={item.id}
                                className="p-4 border rounded bg-gray-50 shadow-sm"
                            >
                                <h2 className="font-semibold">{item.name}</h2>
                                <p className="text-gray-600">{item.company?.catchPhrase}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
