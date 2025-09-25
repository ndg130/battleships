import useBattleshipGame from './hooks/useBattleshipGame';
import './styles/App.css';
import Grid from './components/Grid';
function App() {

    const gridSize = 10;
    const battleShips = [
        {
            id: 1,
            name: 'Battleship',
            size: 5
        },
        {
            id: 2,
            name: 'Destroyer',
            size: 4
        },
        {
            id: 3,
            name: 'Destroyer',
            size: 4
        }
    ]

    const {
        shipCells,
        remainingCells,
        hitCells,
        move,
        setMove,
        message,
        handleMove,
        initGame,
    } = useBattleshipGame(gridSize, battleShips);

    return (
        <main>
            <h1 style={{color: 'white', textAlign: 'center'}}>Battleships</h1>
            <div id='battleGrid'>
                <Grid 
                    gridSize={gridSize}
                    shipCells={shipCells}
                    hitCells={hitCells}
                />
            </div>            
            <div className='controls'>
                <p className={`controls__message controls__message--${message !== '' ? 'visible' : 'empty'}`}>{message}</p>
                <form 
                id="submitMove"
                className='controls__form'
                action="#" 
                onSubmit={handleMove}
                >
                    <input 
                    className='controls__input'
                    value={move}
                    type="text"
                    maxLength={Math.abs(gridSize * gridSize).toString().length + 1}
                    onChange={(e) => setMove(e.target.value.toUpperCase())}
                    placeholder='Enter a cell (e.g. A6)'
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='on'
                    disabled={remainingCells.flat().length === 0 ? 'disabled' : ''}
                    />
                    {remainingCells.flat().length > 0 && (
                        <button type="submit" className='controls__button'>Submit</button>
                    )}

                    {remainingCells.flat().length === 0 && (
                        <button type="button" className='controls__button' onClick={initGame}>Restart</button>
                    )}
                </form>
            </div>
        </main>

    )
}

export default App
