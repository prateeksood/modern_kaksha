import React from 'react';
import styles from './loader.module.scss'

const Loader=()=>{
    return(
        <>
        <div className={styles.loader}>
            <div className={styles.spinner}>
                <div className={styles.rect1}></div>
                <div className={styles.rect2}></div>
                <div className={styles.rect3}></div>
                <div className={styles.rect4}></div>
                <div className={styles.rect5}></div>
            </div>
            <p>Loading...</p>
        </div>
        </>
    )
}

export default Loader;