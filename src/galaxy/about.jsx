import React from 'react';
export default require('maco').template(about, React);

function about() {
  return (
  <div  className='label about'>
     <a className='reset-color'
        target='_blank'
        href="http://studioalight.com/2018/03/22/lagrymden/">About...</a>
  </div>
  );
}
