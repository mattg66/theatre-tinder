import React, { useState, useMemo, useRef, useEffect } from 'react'
import TinderCard from './TinderCard'
import { socket } from '../utils/socket';

const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  

export default function TinderStack({images}) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [remoteSwipe, setRemoteSwipe] = useState()
    const [localSwipe, setLocalSwipe] = useState(1)
    const [isAnimating, setIsAnimating] = useState(false);

    const childRefs = useMemo(() => Array(images.length).fill(0).map((i) => React.createRef()), [images.length])


    
    useEffect(() => {
        const handle = async () => {
            await sleep(1000)
            const {
                dir,
                swipeCount
            } = remoteSwipe || {swipeCount: undefined, dir: undefined}
            console.log(remoteSwipe)
            if (childRefs[currentIndex] && remoteSwipe !== undefined && localSwipe < swipeCount) {
                await childRefs[currentIndex].current.swipe(dir || "left")
            }
        }

        handle();

    }, [remoteSwipe, localSwipe])

    useEffect(() => {

        setRemoteSwipe(undefined);

        const swipeCountHandler = (swipeCount) => {
            setRemoteSwipe({swipeCount})
            setCurrentIndex(0);
            setLocalSwipe(1);
        }

        socket.emit('GET-SWIPE-COUNT')
        socket.on('SWIPE-COUNT', swipeCountHandler)
        const handler = ({dir, swipeCount}) => {
            setRemoteSwipe({dir, swipeCount})
        }
        
        socket.on('SWIPE', handler)



        return () => {
            socket.off('SWIPE', handler)
            socket.off('SWIPE-COUNT', swipeCountHandler)
        }
    }, [images])

    const canGoBack = currentIndex < images.length - 1;
    const canSwipe = currentIndex >= 0


    // set last direction and decrease current index
    const swiped = (dir, nameToDelete, index) => {
        console.log({localSwipe, test: remoteSwipe.swipeCount})
        if (localSwipe >= remoteSwipe.swipeCount) {
            socket.emit('SWIPE', dir);
            setRemoteSwipe({dir, swipeCount: remoteSwipe.swipeCount + 1})
        }
        setLocalSwipe((localSwipe) => localSwipe + 1)
        setCurrentIndex(index => index + 1)
    }

    // const outOfFrame = (name, idx) => {
    //     console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    //     // handle the case in which go back is pressed before card goes outOfFrame
    //     // TODO: when quickly swipe and restore multiple times the same card,
    //     // it happens multiple outOfFrame events are queued and the card disappear
    //     // during latest swipes. Only the last outOfFrame event should be considered valid
    // }
    const swipe = async (dir) => {
        if (canSwipe && currentIndex < images.length) {
            setIsAnimating(true);
            childRefs[currentIndex].current.swipe(dir).finally(()=> setIsAnimating(false));
        }
    }

    // increase current index and show card
    const goBack = async () => {
        if (currentIndex <= 0) return;

        const newIndex = currentIndex - 1
        setCurrentIndex(newIndex)
        setIsAnimating(true);
        childRefs[newIndex].current.restoreCard().finally(() => setIsAnimating(false))
    }

    return (
        <div>
            <link
                href='https://fonts.googleapis.com/css?family=Damion&display=swap'
                rel='stylesheet'
            />
            <link
                href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
                rel='stylesheet'
            />
            <h1>React Tinder Card</h1>
            <div className='cardContainer'>
                {remoteSwipe !== undefined && images.map((character, i) => {
                    const index = images.length - i - 1;

                    return (
                    <TinderCard
                        ref={childRefs[index]}
                        className='swipe'
                        key={character}
                        onSwipe={(dir) => swiped(dir, character, index)}
                        // onCardLeftScreen={() => outOfFrame(character, index)}
                    >
                        <div
                            style={{ backgroundImage: 'url(' + '/api/image/get/' + character + ')' }}
                            className='card'
                        >
                            <h3></h3>
                        </div>
                    </TinderCard>
                )})}
            </div>
            <div className='buttons'>
                <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} disabled={isAnimating} onClick={() => swipe('left')}>Swipe left!</button>
                <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} disabled={isAnimating} onClick={() => goBack()}>Undo swipe!</button>
                <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} disabled={isAnimating} onClick={() => swipe('right')}>Swipe right!</button>
            </div>
            {remoteSwipe?.dir ? (
                <h2  className='infoText'>
                    You swiped {remoteSwipe.dir}
                </h2>
            ) : (
                <h2 className='infoText'>
                    Swipe a card or press a button to get Restore Card button visible!
                </h2>
            )}
        </div>
    )
}