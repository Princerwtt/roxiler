import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TransactionDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('March');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [stats, setStats] = useState({ totalSale: 0, totalSoldItems: 0, totalNotSoldItems: 0 });
    const [chartData, setChartData] = useState([]);
    const transactionsPerPage = 3;

    useEffect(() => {
        fetchTransactions();
        fetchStatistics();
        fetchChartData();
    }, [selectedMonth, searchTerm, page]);

    const fetchTransactions = async () => {
        const response = await fetch(`https://664c7d2a35bbda10988094cc.mockapi.io/task1/roxiler?month=${selectedMonth}&page=${page}&search=${searchTerm}`);
        const data = await response.json();
        setTransactions(data);
    };

    const fetchStatistics = async () => {
        const response = await fetch(`https://664c7d2a35bbda10988094cc.mockapi.io/task1/chart?month=${selectedMonth}`);
        const data = await response.json();
        setStats(data[0]);
    };

    const fetchChartData = async () => {
        const response = await fetch(`https://6652d7f9813d78e6d6d65e3d.mockapi.io/v1/chartDatas?month=${selectedMonth}`);
        const data = await response.json();
        const monthData = data.find(item => item.month === selectedMonth);
        if (monthData) {
            const formattedData = [
                { priceRange: '0-100', count: monthData['0-100'] },
                { priceRange: '101-200', count: monthData['101-200'] },
                { priceRange: '201-300', count: monthData['201-300'] },
                { priceRange: '301-400', count: monthData['301-400'] },
                { priceRange: '401-500', count: monthData['401-500'] },
                { priceRange: '501-600', count: monthData['501-600'] },
                { priceRange: '601-700', count: monthData['601-700'] },
                { priceRange: '701-800', count: monthData['701-800'] },
                { priceRange: '801-900', count: monthData['801-900'] },
                { priceRange: '901-above', count: monthData['901-above'] },
            ];
            setChartData(formattedData);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset to first page on new search
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        setPage(1); // Reset to first page on month change
    };

    const renderTransactions = () => {
        const startIndex = (page - 1) * transactionsPerPage;
        const endIndex = startIndex + transactionsPerPage;
        return transactions.slice(startIndex, endIndex).map(transaction => (
            <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold}</td>
                <td><img src={transaction.image} alt={transaction.title} width="50" /></td>
            </tr>
        ));
    };

    return (
        <div>
            <h2>Transaction Dashboard</h2>
            <div>
                <input
                    type="text"
                    placeholder="Search transaction"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={selectedMonth} onChange={handleMonthChange}>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
            </div>
            <div>
                <h3>Statistics - {selectedMonth}</h3>
                <p>Total sale: {stats.totalSale}</p>
                <p>Total sold items: {stats.totalSoldItems}</p>
                <p>Total not sold items: {stats.totalNotSoldItems}</p>
            </div>
            <div>
                <h3>Bar Chart Stats - {selectedMonth}</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="priceRange" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTransactions()}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
                <span>Page No: {page}</span>
                <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default TransactionDashboard;
