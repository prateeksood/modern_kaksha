import {Helmet} from "react-helmet";
import styles from './pageNotFoundErrorPage.module.scss';
import React from 'react';
import {Link} from 'react-router-dom'

const PageNotFoundErrorPage=()=> {
  return (
        <div className={styles.pageNotFoundErrorPage}>
            <Helmet>
                <title>Page not found | Modern Kaksha</title>
                <meta
                    name="description"
                    content="Page you are looking for does not exist or is moved to another location."
                />
            </Helmet>
            <div className={styles.errorHolder}>
                <div className={styles.ErrorMsg}>
                        <h1>404</h1>
                        <p>
                            Page you are looking for does not exist or is moved to another location.
                        </p>
                        <div className={styles.goHomeBtn}><Link to='/'>Home</Link></div>
                </div>
            </div>
        </div>
  );
}

export default PageNotFoundErrorPage;
