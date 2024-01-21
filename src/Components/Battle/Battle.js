import './Battle.css';
import { useEffect } from 'react'
import { useState } from 'react';

//configure:

let isOurTurn = true;
let ownPokeAnim = false;
let isStart = true;
let isStart2 = false;
let maxOurHp = 0;
let maxEnemyHp = 0;
let ourHp = 0;
let enemyHp = 0;

function Battle(props) {
    let waitTime = 4000; //in msec
    let minColor = { r: 200, g: 20, b: 50 };
    let maxColor = { r: 10, g: 170, b: 20 };
    const ourPokeName = formatString(props.ourPoke.name);
    const enemyPokeName = formatString(props.enemyPoke.name);
    const [enemyColor, setEnemyColor] = useState(maxColor);
    const [ourColor, setOurColor] = useState(maxColor);
    const [description, setDesc] = useState(`Wild ${enemyPokeName} appears!`);
    const [startAnim, setStartAnim] = useState(true);
    const [isWin, setIsWin] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const ourPoke = props.ourPoke;
    const enemyPoke = props.enemyPoke;
    maxOurHp = ourPoke.stats[0].base_stat;
    maxEnemyHp = enemyPoke.stats[0].base_stat;

    useEffect(() => {
        isStart = true;
        isOurTurn = true;
        ownPokeAnim = false;
        isOurTurn = true;
        ourHp = maxOurHp;
        enemyHp = maxEnemyHp;
        maxOurHp = ourPoke.stats[0].base_stat;
        maxEnemyHp = enemyPoke.stats[0].base_stat;
        setEnemyColor(calulateColor(enemyHp, maxEnemyHp));
        setTimeout(function () {
            setDesc(`${ourPokeName}!, I Choose you!`);
            setTimeout(function () {
                isStart2 = true;
                setDesc(`Choose your next move!`);
            }, 3000);
        }, 4000);
    }, [])

    if (isStart) {
        isStart = false;
        isStart2 = false;
    }

    //calculate color by hp amount
    function calulateColor(Hp, maxHp) {
        let ratio = Hp / maxHp;
        let rMax = maxColor.r - minColor.r;
        let gMax = maxColor.g - minColor.g;
        let bMax = maxColor.b - minColor.b;
        return ({
            r: (ratio * rMax) + minColor.r,
            g: (ratio * gMax) + minColor.g,
            b: (ratio * bMax) + minColor.b
        });
    }

    //formats string by capitalizing the first letter and replaces dashes with spaces
    function formatString(string) {
        return (string.charAt(0).toUpperCase() + string.slice(1)).replace('-', " ");
    }

    function run() {
        isStart2 = false;
        setIsEnd(true);
        props.winnerFunction(enemyPoke, false);
        isStart = true;
        setStartAnim(true);
    }

    function checkFinnish() {
        if (ourHp > 0 && enemyHp <= 0) {
            isStart2 = false;
            setIsWin(true);
            setIsEnd(true);
            props.winnerFunction(enemyPoke, true);
            isStart = true;
            setStartAnim(true);
        }
        else if (ourHp <= 0) {
            isStart2 = false;
            setIsEnd(true);
            props.winnerFunction(enemyPoke, false);
            isStart = true;
            setStartAnim(true);
        }
    }

    function damage(poke1, poke2) {
        let z = Math.floor(Math.random() * (255 - 217) + 217);//random between 217-255      
        let d = poke1.stats[2].base_stat;//defense
        let b = poke2.stats[1].base_stat; //attack
        return ((((2 / 5 + 2) * b * 60 / d) / 50) + 2) * z / 255;
    }
    function fight(attackType) {
        setStartAnim(false);
        attackType = 0;
        if (!isOurTurn) {
            return;
        }
        const dmg= damage(enemyPoke, ourPoke)
        enemyHp -= parseInt(dmg);
        checkFinnish();
        setEnemyColor(calulateColor(enemyHp, maxEnemyHp));
        setDesc(`${ourPokeName} uses ${formatString(ourPoke.abilities[attackType].ability.name)} and deals ${parseInt(dmg)} damage to ${enemyPokeName}!`);
        isOurTurn = !isOurTurn;
        setTimeout(enemyFight, waitTime);
    }

    function enemyFight(attackType) {
        attackType = 0;
        if (isOurTurn) {
            return;
        }
        const dmg = damage(ourPoke, enemyPoke);
        ourHp -= parseInt(dmg);
        checkFinnish();
        setOurColor(calulateColor(ourHp, maxOurHp));
        setDesc(`${enemyPokeName} uses ${formatString(enemyPoke.abilities[attackType].ability.name)} and deals ${parseInt(dmg)} damage to ${ourPokeName}!`);
        ownPokeAnim = true;
        setTimeout(function () {
            isOurTurn = !isOurTurn;
            ownPokeAnim = false;
            setDesc(`Choose your next move!`);
        }, waitTime);
    }

    return (
        <div className='Battle'>
            {!isEnd ? (
                <div>
                    <div className='battleMain'>
                        <div className='enemyPoke'>
                            <div className={`pokeDetail ${startAnim ? "pokeShowDetailEnemy" : ""}`} style={{ borderTopLeftRadius: `40px`, borderTopRightRadius: `10px` }}>
                                {enemyPokeName}
                                <div className="hpBar">
                                    <div style={{ width: `${enemyHp / maxEnemyHp * 100}%`, backgroundColor: `rgb(${enemyColor.r}, ${enemyColor.g},${enemyColor.b})` }} className="hpBarFill" ></div>
                                    <div className="hpBarText">{enemyHp} / {maxEnemyHp}</div>
                                </div>
                            </div>
                            <div className={`pokeImg ${startAnim ? "pokeShowEnemy" : ""}`} style={{ 'animation': ` ${isOurTurn ? '' : 'blinker .5s step-start 4 forwards'}`, backgroundImage: `url(${props.enemyPoke.sprites.front_default})` }}></div>
                        </div>
                        <div className='ourPoke'>
                            <div className={`pokeImg ${startAnim ? "pokeShowOur" : ""}`}
                                style={{ 'animation': ` ${ownPokeAnim ? 'blinker .5s step-start 4 forwards' : ''}`, backgroundImage: `url(${props.ourPoke.sprites.back_default})` }}>
                            </div>
                            <div className={`pokeDetail ${startAnim ? "pokeShowDetailOur" : ""}`} style={{ borderTopRightRadius: `40px`, borderTopLeftRadius: `10px` }}>
                                {ourPokeName}
                                <div className="hpBar">
                                    <div style={{ width: `${ourHp / maxOurHp * 100}%`, backgroundColor: `rgb(${ourColor.r}, ${ourColor.g},${ourColor.b})` }} className="hpBarFill"></div>
                                    <div className="hpBarText">{ourHp} / {maxOurHp}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='battlePanel'>
                        <div className='battlePanelText'>
                            {description}
                        </div>
                        {isStart2 ? (<div style={{ 'animation': ` ${isOurTurn ? 'showButtons 1s forwards' : 'hideButtons 1s forwards'}` }} className='battlePanelButtons'>
                            <button className='battlePanelButton' onClick={fight}>FIGHT</button>
                            <button className='battlePanelButton' onClick={run} >RUN</button>
                        </div>) : (``)}
                    </div>
                </div>
            ) : (<h1>
                {isWin ? (`${enemyPokeName} has been added to our collection!`) : (`${enemyPokeName} managed to escape!`)}
            </h1>
            )}
        </div>
    );
}


export default Battle;


