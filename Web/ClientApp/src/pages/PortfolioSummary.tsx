import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {getPortfolioValueHistory} from "../api/value-history/Client";

import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import CustomAreaChart from "../components/charts/CustomAreaChart";

const data = [
    { date: '2023-01', stocks: 50, bonds: 30, cash: 20 },
    { date: '2023-02', stocks: 55, bonds: 25, cash: 20 },
    { date: '2023-03', stocks: 60, bonds: 20, cash: 20 },
    { date: '2023-04', stocks: 58, bonds: 27, cash: 15 },
    { date: '2023-05', stocks: 62, bonds: 23, cash: 15 }
];

function PortfolioStreamChartWithGradients() {
    return (
        <CustomAreaChart 
            data={data} 
            yDataKeys={['stocks', 'bonds', 'cash']}
            xDataKey='date'
            domain={[0, 100]}
        />
        // <ResponsiveContainer width="100%" height={400}>
        //     <AreaChart data={data}>
        //         {/* Gradient definitions */}
        //         <defs>
        //             <linearGradient id="colorStocks" x1="0" y1="0" x2="0" y2="1">
        //                 <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
        //                 <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
        //             </linearGradient>
        //             <linearGradient id="colorBonds" x1="0" y1="0" x2="0" y2="1">
        //                 <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
        //                 <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2}/>
        //             </linearGradient>
        //             <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
        //                 <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
        //                 <stop offset="95%" stopColor="#ffc658" stopOpacity={0.2}/>
        //             </linearGradient>
        //         </defs>
        //
        //         <XAxis
        //             dataKey="date"
        //             tick={{ fontSize: 12, fill: '#666' }}
        //         />
        //         <YAxis
        //             domain={[0, 100]}
        //             tickFormatter={(v) => `${v}%`}
        //             tick={{ fontSize: 12, fill: '#666' }}
        //         />
        //         <Tooltip formatter={(value) => `${value}%`} />
        //         <Legend />
        //
        //         <Area
        //             type="basis"
        //             dataKey="stocks"
        //             stackId="1"
        //             stroke="#8884d8"
        //             fill="url(#colorStocks)"
        //         />
        //         <Area
        //             type="basis"
        //             dataKey="bonds"
        //             stackId="1"
        //             stroke="#82ca9d"
        //             fill="url(#colorBonds)"
        //         />
        //         <Area
        //             type="basis"
        //             dataKey="cash"
        //             stackId="1"
        //             stroke="#ffc658"
        //             fill="url(#colorCash)"
        //         />
        //     </AreaChart>
        // </ResponsiveContainer>
    );
}


const PortfolioSummary = () => {
    
    return PortfolioStreamChartWithGradients();
    // return <SimpleComponentsPage
    //     title='Portfolio Summary'
    //     defaultGranularity={DateGranularity.Month}
    //     getData={getPortfolioValueHistory}
    //     showInferredValues={false}
    // />;
};

export default PortfolioSummary;
