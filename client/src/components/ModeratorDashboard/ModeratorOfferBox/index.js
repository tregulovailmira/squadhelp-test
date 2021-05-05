import React from 'react';
import PropTypes from 'prop-types';
import { confirmAlert } from 'react-confirm-alert';
import cx from 'classnames';
import CONSTANTS from '../../../constants';
import styles from './ModeratorOfferBox.module.sass';

function ModeratorOfferBox (props) {
  const {
    offer: {
      id, text, fileName, contestId, userId: creatorId, moderationStatus,
      Contest: { title, contestType, userId: customerId },
      User: { firstName, lastName, avatar, email: creatorEmail }
    },
    showImage, setOfferStatus
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
    });
  };

  const renderModerationStatus = () => {
    switch (moderationStatus) {
      case CONSTANTS.MODERATION_STATUS_APPROVE:
        return <span className={cx('fas fa-check-circle', styles.status, styles.approve)}></span>;

      case CONSTANTS.MODERATION_STATUS_DECLINE:
        return <span className={cx('fas fa-times-circle', styles.status, styles.decline)}></span>;

      default: return null;
    }
  };

  const approveButtonClasses = cx(styles.controls, styles.approveButton);
  const declineButtonClasses = cx(styles.controls, styles.declineButton);

  return (
        <div className={styles.offerContainer}>
            { renderModerationStatus() }

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
                    <div className={approveButtonClasses} onClick={() => moderateOffer('approve')}>Approve</div>
                    <div className={declineButtonClasses} onClick={() => moderateOffer('decline')}>Decline</div>
                </>
            }
        </div>
  );
}

ModeratorOfferBox.propTypes = {
  offer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string,
    fileName: PropTypes.string,
    contestId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    moderationStatus: PropTypes.string.isRequired,
    Contest: PropTypes.shape({
      title: PropTypes.string.isRequired,
      contestType: PropTypes.string.isRequired,
      userId: PropTypes.number.isRequired
    }),
    User: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    })
  }),
  showImage: PropTypes.func,
  setOfferStatus: PropTypes.func
};

export default ModeratorOfferBox;
