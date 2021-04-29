import 'react-mde/lib/styles/css/react-mde-all.css';
import s from '@assets/mde.module.css';

import React from 'react';
import matter from 'gray-matter';
import ReactMde from 'react-mde';
import Showdown from 'showdown';
import cn from 'classnames';
import uploadImage from '@lib/image/uploadImage';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const loadSuggestions: (text: any) => any = (text) => {
  return new Promise((accept, reject) => {
    setTimeout(() => {
      const suggestions = [
        {
          preview: 'Andre',
          value: '@andre',
        },
        {
          preview: 'Angela',
          value: '@angela',
        },
        {
          preview: 'David',
          value: '@david',
        },
        {
          preview: 'Louise',
          value: '@louise',
        },
      ].filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
      accept(suggestions);
    }, 250);
  });
};

const IndexPage = () => {
  const [value, setValue] = React.useState('**Hello world!!!**');
  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write',
  );
  const save = async function* (data: ArrayBuffer) {
    yield await uploadImage(data);

    return true;
  };

  return (
    <div className={cn(s.root, 'w-full h-[600px] p-2.5')}>
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
        paste={{
          saveImage: save,
        }}
      />
    </div>
  );
};

export default IndexPage;
