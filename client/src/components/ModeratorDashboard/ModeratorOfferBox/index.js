import React from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { confirmAlert } from 'react-confirm-alert'
import { changeShowImage } from '../../../actions/actionCreator';
import { setModerationStatusAction } from '../../../actions/actionCreator';
import CONSTANTS from '../../../constants';

export default function ModeratorOfferBox(props) {

    const dispatch = useDispatch();
    const showImage = bindActionCreators(changeShowImage, dispatch);
    const setOfferStatus = bindActionCreators(setModerationStatusAction, dispatch);

    const {
        offer: {
            id, text, fileName, contestId, userId: creatorId,
            Contest: { title, contestType, userId: customerId }, 
            User: { firstName, lastName, avatar, email: creatorEmail }  
        }
    } = props;

    const moderateOffer = (status) => {
        const data = {
            offerId: id,
            moderationStatus: status,
            creatorEmail,
            customerId,
            creatorId,
            contestId
        };
        confirmAlert({
            title: 'confirm',
            message: 'Are u sure?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => setOfferStatus(data)
                },
                { label: 'No' }
            ]
        })
    }
    
    return (
        <div>
            <div>
                <span>Contest: {title}</span>
                <span>#{contestId}</span>
            </div>

            <div>
                <img
                    src={avatar === 'anon.png' ? CONSTANTS.ANONYM_IMAGE_PATH : `${CONSTANTS.publicURL}${avatar}`}
                    alt='user'
                />
                <div>
                    <span>{firstName}</span>
                    <span>{lastName}</span>
                    <span>{creatorEmail}</span>
                </div>
            </div>

            <div>
                { contestType === CONSTANTS.LOGO_CONTEST
                    ? <img onClick={() => showImage({ imagePath: fileName, isShowOnFull: true })}
                            src={`${CONSTANTS.publicURL}${fileName}`} alt='logo'/>
                    : <span>{text}</span>
                }
            </div>

            <div>
                <div onClick={()=>moderateOffer('approve')}>Approve</div>
                <div onClick={()=>moderateOffer('decline')}>Decline</div>
            </div>
        </div>
    )
}
