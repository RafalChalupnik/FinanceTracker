import { WalletsSummary } from "./components/WalletsSummary";
import {PortfolioSummary} from "./components/PortfolioSummary";
import {Wallets} from "./components/Wallets";

const AppRoutes = [
  {
    index: true,
    path: '/',
    element: <PortfolioSummary />
  },
  {
    path: '/wallets-summary',
    element: <WalletsSummary />
  },
  {
    path: '/wallets',
    element: <Wallets />
  },
];

export default AppRoutes;
