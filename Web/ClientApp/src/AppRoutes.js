import { WalletsSummary } from "./components/WalletsSummary";
import {PortfolioSummary} from "./components/PortfolioSummary";
import {Wallets} from "./components/Wallets";
import {Assets} from "./components/Assets";

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
  {
    path: '/assets',
    element: <Assets />
  },
];

export default AppRoutes;
