import './App.css';
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller';

function App() {

  const [freddos, setFreddos] = useState(0);
  const [firstLoad, setFirstload] = useState(true)
  const itemsPerPage = 5000;
  const [hasMore, setHasMore] = useState(true);
  const [records, setrecords] = useState(itemsPerPage);

  useEffect(() => {
    if (firstLoad === true) {
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=gbp", {mode:'cors', headers: {'Access-Control-Allow-Origin': '*'}})
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (typeof data.bitcoin.gbp === 'number') {
            setFreddos(Math.floor(data.bitcoin.gbp / 0.25));
          } else {
            document.querySelector('.loading').style.display = 'none';
            document.querySelector('.error').style.display = 'flex';
            console.log(`Invalid data from API`)
            console.log(data)
          }
        })
        .catch((err) => {
          document.querySelector('.loading').style.display = 'none';
          document.querySelector('.error').style.display = 'flex';
          console.log(err)
        });
      setFirstload(false)
    }
  }, [firstLoad])

  useEffect(() => {
    if (freddos !== 0) {
      document.querySelector('.freddo-container').style.display = 'flex';
      document.querySelector('.loading').style.display = 'none';
      document.querySelector('.btc-price').style.display = 'flex';
    } else {
      document.querySelector('.btc-price').style.display = 'none';
      document.querySelector('.loading').style.display = 'flex';
      document.querySelector('.freddo-container').style.display = 'none';
    }
  }, [freddos])

  function showFreddos(number) {
    let freddos = [];
    for (var i = 0; i < records; i++) {
      freddos.push(
        <div className="freddo-item" key={i}>
          <img alt='' className='freddo-img' src='./freddo.png' />
        </div>
      );
    }
    return freddos;
  };

  function loadMore() {
    if (records === freddos) {
      setHasMore(false);
    } else {
      setTimeout(() => {
        setrecords(records + itemsPerPage);
      }, 10);
    }
  }

  return (
    <div className="App">
      <header className="App-header">

        <div className="loading">Loading...</div>

        <div className="btc-price">One BTC is worth {freddos} freddos.</div>

        <div className='error'>Couldn't get BTC price.</div>

        <InfiniteScroll
          className='freddo-container'
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMore}
          useWindow={true}
          threshold={1000}
          >
          {showFreddos(freddos)}
        </InfiniteScroll>
      </header>
    </div>
  );
}

export default App;
