import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllOffersAction } from '../../actions/actionCreator';
import ModeratorOfferBox from './ModeratorOfferBox';
import styles from './ModeratorDashboard.module.sass';

export default function ModeratorDashboard() {

    const { isFetching, error, offers, haveMore } = useSelector(state => state.offersStore)
    const dispatch = useDispatch();
    const getOffers = bindActionCreators(getAllOffersAction, dispatch);
    
    useEffect(() => {
        getOffers({limit: 8, offset: offers.length})
    }, [])

    return (
        <div className={styles.mainContainer}>
            { isFetching && <div className={styles.loader}>LOADING...</div> }
            <div className={styles.offersList}>
            {offers.map(offer => <ModeratorOfferBox key={offer.id} offer={offer}/>)}
            </div>
        </div>

    )
}
