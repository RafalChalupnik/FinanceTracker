import { WalletsSummary } from "./components/WalletsSummary";
import {PortfolioSummary} from "./components/PortfolioSummary";

const AppRoutes = [
  {
    index: true,
    path: '/',
    element: <PortfolioSummary />
  },
  {
    path: '/wallets',
    element: <WalletsSummary />
  },
];

export default AppRoutes;
