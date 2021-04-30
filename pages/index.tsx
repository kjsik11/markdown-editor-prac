import 'react-mde/lib/styles/css/react-mde-all.css';
import s from '@assets/mde.module.css';
import React from 'react';
import ReactMde from 'react-mde';
import Showdown from 'showdown';
import cn from 'classnames';
import uploadImage from '@lib/image/uploadImage';
import marked from 'marked';
import getMdFile from '@lib/getMdFile';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const IndexPage = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [value, setValue] = React.useState("Jongsik's Markdown Editor!!");
  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write',
  );
  const [mdUrl, setMdurl] = React.useState<string>('');
  const [mdText, setMdText] = React.useState<string | null>(null);

  const save = async function* (data: ArrayBuffer) {
    yield await uploadImage(
      new File([new Blob([data])], String(Number(new Date()))),
    );

    return true;
  };

  const handleUploadMd = React.useCallback(async (value: string) => {
    setLoading(true);
    const url = await uploadImage(value, true);

    setMdurl(url);
    setLoading(false);
  }, []);

  const handleGetMdText = React.useCallback(async (url: string) => {
    setLoading(true);

    const md = await getMdFile(url);

    setMdText(marked(md.split('\n').join('<br />')));

    setLoading(false);
  }, []);

  return (
    <div className={cn(s.root, 'w-full h-[800px] p-2.5 max-w-5xl mx-auto')}>
      <p className="py-10 font-semibold text-4xl">React Markdown Editor</p>
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
      <div className="text-right pt-4 font-semibold text-lg pr-2">
        <button
          disabled={loading}
          className="border py-1 px-2 hover:opacity-80 bg-gray-400 rounded-md"
          onClick={() => handleUploadMd(value)}
        >
          Upload MD File
        </button>
        <button
          disabled={loading}
          className="border py-1 px-2 hover:opacity-80 bg-gray-400 rounded-md ml-4"
          onClick={() => handleGetMdText(mdUrl)}
        >
          Get MD File
        </button>
      </div>
      {mdUrl && (
        <p className="text-md font-semibold mt-4">MD File URL: {mdUrl}</p>
      )}
      {mdText && (
        <div className="flex mt-4 pb-20">
          <div className="text-md font-semibold">MD File Result:&nbsp;</div>
          <div
            dangerouslySetInnerHTML={{
              __html: mdText,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default IndexPage;
