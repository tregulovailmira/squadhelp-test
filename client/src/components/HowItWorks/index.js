import React from 'react';
import StartingWorkSteps from './StartingWorkSteps';
import Button from './Button';
import Faq from './Faq';
import styles from './HowItWorks.module.sass';

export default function HowItWorks () {
  return (
        <div className={styles.mainContainer}>
            <div className={styles.videoSection}>
                <video controls controlslist='nodownload nofullscreen' disablePictureInPicture className={styles.video}>
                    <source src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4"/>
                </video>
                <div className={styles.videoDescription}>
                    <h2>How Does Squadhelp Work?</h2>
                    <p>
                        Squadhelp allows you to host branding competitions to engage with the most creative people across the globe and get high-quality results, fast. Thousands of creatives compete with each other, suggesting great name ideas. At the end of the collaborative contest, you select one winner. The winner gets paid, and you get a strong brand name that will help you succeed! It&apos;s quick, simple, and costs a fraction of an agency.
                    </p>
                </div>
            </div>
            <StartingWorkSteps/>
            <div className={styles.buttonContainer}>
                <Button to="/" text="start a contest"/>
            </div>
            <Faq/>
        </div>
  );
}
