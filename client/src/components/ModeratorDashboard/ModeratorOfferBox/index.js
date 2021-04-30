import React from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { confirmAlert } from 'react-confirm-alert';
import cx from 'classnames';
import { changeShowImage } from '../../../actions/actionCreator';
import { setModerationStatusAction } from '../../../actions/actionCreator';
import CONSTANTS from '../../../constants';
import styles from './ModeratorOfferBox.module.sass';

export default function ModeratorOfferBox(props) {

    const dispatch = useDispatch();
    const showImage = bindActionCreators(changeShowImage, dispatch);
    const setOfferStatus = bindActionCreators(setModerationStatusAction, dispatch);

    const {
        offer: {
            id, text, fileName, contestId, userId: creatorId, moderationStatus,
            Contest: { title, contestType, userId: customerId }, 
            User: { firstName, lastName, avatar, email: creatorEmail }  
        }
    } = props;

    const moderateOffer = (status) => {
        const data = {
            offerId: id,
            creatorEmail,
            customerId,
            creatorId,
            contestId,
            moderationStatus: status
        };
        confirmAlert({
            title: 'Confirm',
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

    const mooderationStatus = () => {
        if(moderationStatus === CONSTANTS.MODERATION_STATUS_APPROVE) {
           return <span className={cx('fas fa-check-circle', styles.status, styles.approve)}></span>
        }

        if(moderationStatus === CONSTANTS.MODERATION_STATUS_DECLINE) {
           return <span className={cx('fas fa-times-circle', styles.status, styles.decline)}></span>
        }
    }

    const approveButtonClasses = cx(styles.controls, styles.approveButton);
    const declineButtonClasses = cx(styles.controls, styles.declineButton);
    
    return (
        <div className={styles.offerContainer}>
            { mooderationStatus() }
            <div className={styles.contestInfo}>
                <span>Contest: {title}</span>
                <span>&nbsp;#{contestId}</span>
            </div>

            <div className={styles.creator}>
                <img
                    className={styles.avatar}
                    src={avatar === 'anon.png' ? CONSTANTS.ANONYM_IMAGE_PATH : `${CONSTANTS.publicURL}${avatar}`}
                    alt='user'
                />
                <div className={styles.creatorInfo}>
                    <span>{firstName}</span>
                    <span>{lastName}</span>
                    <span>{creatorEmail}</span>
                </div>
            </div>

            <div className={styles.offerInfo}>
                { contestType === CONSTANTS.LOGO_CONTEST
                    ? <img onClick={() => showImage({ imagePath: fileName, isShowOnFull: true })}
                            src={`${CONSTANTS.publicURL}${fileName}`} alt='logo' className={styles.logo}/>
                    : <span>{text}</span>
                }
            </div>

            { moderationStatus === CONSTANTS.MODERATION_STATUS_PENDING &&
                <>
                    <div className={approveButtonClasses} onClick={()=>moderateOffer('approve')}>Approve</div>
                    <div className={declineButtonClasses} onClick={()=>moderateOffer('decline')}>Decline</div>
                </>
            }
        </div>
    )
}
