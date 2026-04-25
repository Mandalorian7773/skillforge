import { type PropsWithChildren } from 'react';

// ===== WalletProvider =====
// InterwovenKit is disabled for production deployment because:
// 1. The chain registry doesn't include custom rollup chains (skillforge-1)
// 2. InterwovenKit crashes internally with ".filter() on undefined" when
//    it can't resolve chains from the registry
// 3. React error boundaries can't stop the infinite re-render loop
//
// The app renders fully without wallet — wallet features show as "connect wallet"
// buttons that will work once InterwovenKit is properly configured with a
// registered chain.

export default function WalletProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
