import React from 'react';
import articles from './Faq.json';
import styles from './Faq.module.sass'

export default function Faq() {
    const renderArticles = () => {
        return articles.map((article, index) => 
            <li key={index}>
                <h4>{article.header}</h4>
                <div dangerouslySetInnerHTML={{__html: article.body}}/>
            </li>
        )
    }

    return (
        <div className={styles.faqContainer}>
            <h2>Frequently Asked Questions</h2>
            <ul>
                {renderArticles()}
            </ul>
        </div>

    )
}
