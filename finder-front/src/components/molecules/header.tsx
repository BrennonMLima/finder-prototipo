import React from 'react';
import Text from '../atoms/text/text';


const Header: React.FC = () => {
  return (
    <header>
      <div>
        <Text variant="p">Finder</Text>
      </div>
      <div className='profile'>
      </div>
    </header>
  );
};

export default Header;
