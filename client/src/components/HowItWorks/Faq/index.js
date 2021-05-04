import React from 'react';
import articles from './Faq.json';
import styles from './Faq.module.sass';

export default function Faq () {
  const renderArticles = () => {
    return articles.map((article, index) =>
            <li key={index} className={styles.questionWrapper}>
                <h4 className={styles.questionHeader}>{article.header}</h4>
                <div dangerouslySetInnerHTML={{ __html: article.body }} className={styles.questionBody}/>
            </li>
    );
  };

  return (
        <div className={styles.faqContainer}>
            <div className={styles.mainHeader}>
                <div className={styles.questionIcon}>?</div>
                <h2>Frequently Asked Questions</h2>
            </div>
            <ul className={styles.questionsContainer}>
                {renderArticles()}
            </ul>
        </div>

  );
}
