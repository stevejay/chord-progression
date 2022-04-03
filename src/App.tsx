import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const ChordsPage = lazy(() => import('@/pages/chords'));

export const App: FC = () => (
  <BrowserRouter>
    <Suspense fallback={<p> Loading...</p>}>
      <Routes>
        <Route path="/" element={<ChordsPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

//   return (
//     <div>
//       <header className="flex flex-col items-center space-y-4">
//         <img src={logo} alt="logo" className="w-48 h-48" />
//         <h1 className="text-2xl font-bold">Hello Vite + React! (mode={import.meta.env.MODE})</h1>
//         <p>
//           <button type="button" onClick={() => setCount((count) => count + 1)}>
//             count is: {count}
//           </button>
//         </p>
//       </header>
//     </div>
//   );
