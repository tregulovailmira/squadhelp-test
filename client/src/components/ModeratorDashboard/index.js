import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import LightBox from 'react-image-lightbox';
import { getAllOffersAction, clearOfferStore, changeShowImage, setModerationStatusAction } from '../../actions/actionCreator';
import ModeratorOfferBox from './ModeratorOfferBox';
import TryAgain from '../TryAgain/TryAgain';
import Spinner from '../Spinner/Spinner';
import CONSTANTS from '../../constants';
import styles from './ModeratorDashboard.module.sass';

export default function ModeratorDashboard () {
  const { isFetching, isModerating, error, offers, haveMore, isShowOnFull, imagePath } = useSelector(state => state.offersStore);
  const dispatch = useDispatch();
  const getOffers = bindActionCreators(getAllOffersAction, dispatch);
  const setOfferStatus = bindActionCreators(setModerationStatusAction, dispatch);
  const clearOffers = bindActionCreators(clearOfferStore, dispatch);
  const showImage = bindActionCreators(changeShowImage, dispatch);

  useEffect(() => {
    getOffers({ limit: 8, offset: 0 });
    return () => {
      clearOffers();
    };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [offers]);

  const scrollHandler = () => {
    if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 100) {
      if (haveMore) {
        loadMore();
      }
    }
  };

  const loadMore = () => {
    const moderatedOffersCount = offers.reduce((accumulator, currentValue) => {
      if (currentValue.moderationStatus !== CONSTANTS.MODERATION_STATUS_PENDING) {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);
    const offset = offers.length - moderatedOffersCount;
    getOffers({ limit: 8, offset });
  };

  if (isFetching && !offers.length) {
    return <Spinner/>;
  }

  return (

        <div className={styles.mainContainer}>
            { isShowOnFull && <LightBox
                mainSrc={`${CONSTANTS.publicURL}${imagePath}`}
                onCloseRequest={() => showImage({ isShowOnFull: false, imagePath: null })}
            /> }
            <div style={{ width: '200px', height: '50px' }}>{ isModerating && <Spinner/>}</div>
            { error
              ? <TryAgain getData={loadMore} />
              : <div className={styles.offersList}>
                    { offers.map(offer => <ModeratorOfferBox key={offer.id} offer={offer}
                        showImage={showImage} setOfferStatus={setOfferStatus} />) }
                </div>
            }
            { isFetching && <Spinner/> }
        </div>

  );
}
