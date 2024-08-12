import { useState } from "react";
import './index.scss'

export default function Header() {
    return (
        <div className="header">
            <div className="header__left">
                PDF.ai
            </div>
            <div className="header__right">
                <div>定价</div>
                <div>Chrome扩展程序</div>
                <div>使用案例</div>
                <div>开始使用{'->'}</div>
            </div>
        </div>
    );
}
