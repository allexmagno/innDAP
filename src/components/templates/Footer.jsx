import './Footer.css';
import React from 'react';

export default props => 
    <footer className="footer">
        <div className="table">
        <div class="col-12 col-md-12 d-flex justify-content-end">
            <div class="footer-copyright">
                <div class="container">
                    {/* © 2022 Copyright RNP */}
                </div>
            </div>
        </div>
        <div class="col-12 col-md-12 d-flex justify-content-end">
            <span>
            <a class="grey-text text-lighten-4 right" href="https://magno.eng.br" target="_blank">Developed by Magno Andrade</a>
            </span>
        </div>
        </div>
    </footer>
