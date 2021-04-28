import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllOffersAction } from '../../actions/actionCreator';
import ModeratorOfferBox from './ModeratorOfferBox';

export default function ModeratorDashboard() {

    const { isFetching, error, offers, haveMore } = useSelector(state => state.offersStore)
    const dispatch = useDispatch();
    const getOffers = bindActionCreators(getAllOffersAction, dispatch);
    
    useEffect(() => {
        getOffers({limit: 8, offset: offers.length})
    }, [])

    if(isFetching) {
        return <div>LOADING...</div>
    }

    return (
        <div>
           {offers.map(offer => <ModeratorOfferBox key={offer.id} offer={offer}/>)}
        </div>
    )
}
