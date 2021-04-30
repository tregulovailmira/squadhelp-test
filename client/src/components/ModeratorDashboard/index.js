import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllOffersAction, clearOfferStore } from '../../actions/actionCreator';
import ModeratorOfferBox from './ModeratorOfferBox';
import CONSTANTS from '../../constants';
import styles from './ModeratorDashboard.module.sass';

export default function ModeratorDashboard() {

    const { isFetching, error, offers, haveMore } = useSelector(state => state.offersStore)
    const dispatch = useDispatch();
    const getOffers = bindActionCreators(getAllOffersAction, dispatch);
    const clearOffers = bindActionCreators(clearOfferStore, dispatch);

    useEffect(() => {
        getOffers({limit: 8, offset: 0});
        return () => {
            clearOffers();
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);
        return () => {
            window.removeEventListener('scroll', scrollHandler);
        }
    }, [offers])

    const scrollHandler = () => {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            if (haveMore) {
                loadMore();
            }
        }
    };

    const loadMore = () => {
        const moderatedOffersCount = offers.reduce((accumulator, currentValue) => {
            if(currentValue.moderationStatus !== CONSTANTS.MODERATION_STATUS_PENDING){
                return accumulator + 1;
            }
            return accumulator;
        }, 0);
        const offset = offers.length - moderatedOffersCount;
        getOffers({limit: 8, offset});
    };
    
    return (
        <div className={styles.mainContainer}>
            { isFetching && <div className={styles.loader}>LOADING...</div> }
            <div className={styles.offersList}>
            {offers.map(offer => <ModeratorOfferBox key={offer.id} offer={offer}/>)}
            </div>
        </div>

    )
}
