// 'use client';
// import React, { useEffect, useState } from 'react';
// import { fetchGenre } from '@/hooks/fetchGenre';
// import { Genre } from '@/types/genres';
// import { EvaluatedGenre } from '@/types/genres';
// import Footer from '@/components/display/footer';
// import Header from '@/components/display/header';
// import { useParams } from 'next/navigation';
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '@/firebase/config';
// import RatingDisplay from '@/components/ui/ratingDisplay';
// import styles from './page.module.css';
// import {
//   Handshake,
//   Computer,
//   FlaskConical,
//   Church,
//   CircleDollarSign,
//   BookX,
//   Landmark,
//   Bike,
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// const Enquete = () => {
//   const [genres, setGenres] = useState<Genre[]>([]);
//   const params = useParams();
//   const userId = String(params.userId);
//   const router = useRouter();

//   // 初期値をfalseに設定し、点数が全てつけられている場合のみsubmit可能にする
//   const [canSubmit, setCanSubmit] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const genres = await fetchGenre();
//         setGenres(genres);
//       } catch (error) {
//         console.error('ジャンル取得エラー:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   const setEvaluation = (genre: Genre, evaluation: number) => {
//     const created = new Date();
//     const evaluatedGenre = {
//       id: genre.id,
//       genreName: genre.genreName,
//       keyWords: genre.keyWords,
//       userId: userId,
//       evaluation: evaluation,
//       createdAt: created,
//     };

//     // 評価を更新
//     setGenres((prevGenres) => {
//       return prevGenres.map((g) =>
//         g.id === genre.id ? { ...g, evaluation: evaluatedGenre.evaluation } : g,
//       );
//     });

//     checkIfAllEvaluated();

//     console.log(canSubmit);
//   };

//   const checkIfAllEvaluated = () => {
//     const allEvaluated = genres.every(
//       (genre) => genre.evaluation !== undefined,
//     );
//     setCanSubmit(!allEvaluated); // 評価が全てつけられていない場合、送信ボタン無効化
//   };

//   const updateEvaluation = () => {
//     genres.forEach((genre) => {
//       const addEvaluation = async () => {
//         const docRef = await addDoc(collection(db, 'usersGenresEvaluation'), {
//           userId: genre.userId,
//           genreId: genre.id,
//           evaluation: genre.evaluation,
//           createdAt: genre.createdAt,
//         });
//         console.log('Document written with ID: ', docRef.id);
//       };
//       addEvaluation();
//     });

//     router.push(`/home/${params.userId}`);
//   };

//   return (
//     <div className='flex h-screen flex-col justify-between bg-[#fcfcf9] text-center'>
//       <Header />
//       <div className='flex flex-col items-center justify-center'>
//         <h2 className='mb-8 text-2xl font-bold'>
//           Please add a point of interest
//         </h2>
//         <div className='flex max-w-[360px] flex-col items-center justify-center rounded-lg border border-black p-5 text-center'>
//           <p className='text-xl font-bold'>your interest genre</p>
//           <ul>
//             {genres?.map((genre) => {
//               let GenreIcon;
//               switch (genre.genreName) {
//                 case 'スポーツ':
//                   GenreIcon = Bike;
//                   break;
//                 case '宗教':
//                   GenreIcon = Church;
//                   break;
//                 case 'IT':
//                   GenreIcon = Computer;
//                   break;
//                 case '経済':
//                   GenreIcon = CircleDollarSign;
//                   break;
//                 case 'サイエンス':
//                   GenreIcon = FlaskConical;
//                   break;
//                 case '社会・環境問題':
//                   GenreIcon = Handshake;
//                   break;
//                 case '歴史':
//                   GenreIcon = BookX;
//                   break;
//                 case '政治':
//                   GenreIcon = Landmark;
//                   break;
//                 default:
//                   GenreIcon = Bike;
//                   break;
//               }

//               return (
//                 <li
//                   key={genre.id}
//                   className='flex items-center justify-between'
//                 >
//                   <div className='flex'>
//                     <GenreIcon size={20} className='mr-4' />
//                     <p className='font-bold'>{genre.genreName}</p>
//                   </div>
//                   <RatingDisplay onChange={setEvaluation} genre={genre} />
//                 </li>
//               );
//             })}
//           </ul>

//           <button
//             aria-label='送信する'
//             onClick={updateEvaluation}
//             disabled={canSubmit} // 評価が全てつけられていない場合は送信無効
//             className={`h-12 w-full rounded-md font-bold text-white ${canSubmit ? 'bg-gray-400' : 'bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]'}`}
//           >
//             submit
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Enquete;

'use client';
import React, { useEffect, useState } from 'react';
import { fetchGenre } from '@/hooks/fetchGenre';
import { Genre } from '@/types/genres';
import Footer from '@/components/display/footer';
import Header from '@/components/display/header';
import { useParams, useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import RatingDisplay from '@/components/ui/ratingDisplay';
import {
  Handshake,
  Computer,
  FlaskConical,
  Church,
  CircleDollarSign,
  BookX,
  Landmark,
  Bike,
} from 'lucide-react';

const Enquete = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const params = useParams();
  const userId = String(params.userId);
  const router = useRouter();

  // 送信ボタンの活性/非活性を管理
  const [canSubmit, setCanSubmit] = useState<boolean>(true);

  // マウント時にジャンルを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedGenres = await fetchGenre();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error('ジャンル取得エラー:', error);
      }
    };
    fetchData();
  }, []);

  // genres が更新されたら、全てのジャンルが評価済みかを判定して canSubmit を更新
  useEffect(() => {
    const allEvaluated = genres.every(
      (genre) => genre.evaluation !== undefined,
    );
    // 全て評価済みなら送信ボタンを活性化（＝canSubmitをfalseに）
    setCanSubmit(!allEvaluated);
  }, [genres]);

  // 評価が変更されたときの処理
  const setEvaluation = (genre: Genre, evaluation: number) => {
    const created = new Date();

    setGenres((prevGenres) =>
      prevGenres.map((g) =>
        g.id === genre.id
          ? {
              ...g,
              evaluation,
              createdAt: created,
              userId, // ユーザーIDの紐付けが必要なら付与
            }
          : g,
      ),
    );
  };

  // Firestoreに書き込み
  const updateEvaluation = async () => {
    for (const genre of genres) {
      try {
        const docRef = await addDoc(collection(db, 'usersGenresEvaluation'), {
          userId: genre.userId,
          genreId: genre.id,
          evaluation: genre.evaluation,
          createdAt: genre.createdAt,
        });
        console.log('Document written with ID: ', docRef.id);
      } catch (err) {
        console.error('Firestore書き込みエラー:', err);
      }
    }
    router.push(`/home/${params.userId}`);
  };

  return (
    <div className='flex h-screen flex-col justify-between bg-[#fcfcf9] text-center'>
      <Header />
      <div className='flex flex-col items-center justify-center'>
        <h2 className='mb-8 text-2xl font-bold'>
          Please add a point of interest
        </h2>
        <div className='flex max-w-[360px] flex-col items-center justify-center rounded-lg border border-black p-5 text-center'>
          <p className='text-xl font-bold'>your interest genre</p>
          <ul>
            {genres?.map((genre) => {
              let GenreIcon;
              switch (genre.genreName) {
                case 'スポーツ':
                  GenreIcon = Bike;
                  break;
                case '宗教':
                  GenreIcon = Church;
                  break;
                case 'IT':
                  GenreIcon = Computer;
                  break;
                case '経済':
                  GenreIcon = CircleDollarSign;
                  break;
                case 'サイエンス':
                  GenreIcon = FlaskConical;
                  break;
                case '社会・環境問題':
                  GenreIcon = Handshake;
                  break;
                case '歴史':
                  GenreIcon = BookX;
                  break;
                case '政治':
                  GenreIcon = Landmark;
                  break;
                default:
                  GenreIcon = Bike;
                  break;
              }

              return (
                <li
                  key={genre.id}
                  className='flex items-center justify-between'
                >
                  <div className='flex'>
                    <GenreIcon size={20} className='mr-4' />
                    <p className='font-bold'>{genre.genreName}</p>
                  </div>
                  <RatingDisplay onChange={setEvaluation} genre={genre} />
                </li>
              );
            })}
          </ul>
          <button
            aria-label='送信する'
            onClick={updateEvaluation}
            disabled={canSubmit}
            className={`h-12 w-full rounded-md font-bold text-white ${
              canSubmit
                ? 'bg-gray-400'
                : 'bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]'
            }`}
          >
            submit
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Enquete;
