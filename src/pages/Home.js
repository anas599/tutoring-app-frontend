import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TutoriesGallery from '../components/home/TutoriesGallery';
import { fetchTutories } from '../redux/tutories/tutoriesSlice';

export default function Home() {
  const dispatch = useDispatch();

  const mediaQuery = window.matchMedia('(min-width: 1024px)');
  const { tutories, tutoriesStatus } = useSelector((store) => store.tutories);

  const [translated, setTranslated] = useState(0);
  const [isComputerWidth, setIsComputerWidth] = useState(mediaQuery.matches);
  const [hasReachedMaxScroll, setHasReachedMaxScroll] = useState(true);
  const [amountScrollPages, setAmountScrollPages] = useState(1); // each scroll page = 3 items
  const itemsAmount = useRef(3); // since 1 scroll page is default, 3 items is default too
  const amountToTranslate = useRef(0); // for 1 scroll page there's no need to translate

  const translateLeft = (amountToTranslate) => {
    setTranslated((prev) => prev + amountToTranslate);
  };
  const translateRight = (amountToTranslate) => {
    setTranslated((prev) => prev - amountToTranslate);
  };

  useEffect(() => {
    /* create media match event listener for slider responsiveness */
    const onVwChange = ({ matches }) => {
      setIsComputerWidth(matches);
    };
    mediaQuery.addEventListener('change', onVwChange);
    return () => {
      mediaQuery.removeEventListener('change', onVwChange);
    };
  }, [dispatch]);

  /* Determine if user has reached max permitted scroll in slider */
  useEffect(() => {
    if (tutoriesStatus !== 'fulfilled') return;
    let pagesScrolled = (translated * -1) / amountToTranslate.current;
    // when translated is 0 and amount to translate is also 0 pages scrolled isNaN
    pagesScrolled = Number.isNaN(pagesScrolled) ? 0 : pagesScrolled;
    setHasReachedMaxScroll(amountScrollPages - 1 === pagesScrolled);
  }, [dispatch, translated, amountScrollPages, tutoriesStatus]);

  useEffect(() => {
    if (tutoriesStatus !== 'idle') {
      if (tutoriesStatus !== 'fulfilled') return;
      const scrollPages = Math.ceil(tutories.length / 3);
      setAmountScrollPages(scrollPages);
      itemsAmount.current = 3 * scrollPages;
      amountToTranslate.current = 100 / scrollPages;
      return;
    }
    dispatch(fetchTutories()); // fetch tutories when tutoriesStatus is idle
  }, [dispatch, tutoriesStatus, tutories.length]);

  return (
    <section className="center-container relative">
      <div>
        <div className="all:center-text mb-1">
          <h1 className="title">Tutories Subjects</h1>
          <p className="subtitle">
            Please select a subject about which you would like to receive
            tutories
          </p>
        </div>
        <div className="separator mb-2" />
        <TutoriesGallery
          tutories={tutories}
          isComputerWidth={isComputerWidth}
          amountScrollPages={amountScrollPages}
          itemsAmount={itemsAmount.current}
          translated={translated}
        />
      </div>
      {isComputerWidth && (
        <>
          <button
            type="button"
            className="arrow arrow--left"
            onClick={() => {
              translateLeft(amountToTranslate.current);
            }}
            disabled={translated === 0}
          >
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
          <button
            type="button"
            className="arrow arrow--right"
            onClick={() => {
              translateRight(amountToTranslate.current);
            }}
            disabled={hasReachedMaxScroll}
          >
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        </>
      )}
    </section>
  );
}
