//useSWR allows the use of SWR inside function components
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import debounce from 'lodash.debounce';

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());



export default function Index() {
  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { data, error } = useSWR('/api/staticdata', fetcher);

  const [descriptionValue, setDescriptionValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [typeValue, setTypeValue] = useState('');
  const [slotValue, setSlotValue] = useState('');

  const handleChangeName = (e) => {
    setNameValue(e.target.value);
  }

  const handleChangeType = (e) => {
    setTypeValue(e.target.value);
  }

  const handleChangeSlot = (e) => {
    setSlotValue(e.target.value);
  }

  const handleChangeDescription = (e) => {
    setDescriptionValue(e.target.value);
  }

  const debouncedChangeName = useMemo(
    () => debounce(handleChangeName, 500),
    [nameValue]
  );

  const debouncedChangeType = useMemo(
    () => debounce(handleChangeType, 500),
    [typeValue]
  );

  const debouncedChangeDescription = useMemo(
    () => debounce(handleChangeDescription, 500),
    [descriptionValue]
  );

  const debouncedChangeSlot = useMemo(
    () => debounce(handleChangeSlot, 500),
    [slotValue]
  );

  const removeAccents = (str) => { return str .toLowerCase() .normalize("NFD") .replace(/[\u0300-\u036f]/g, ""); };

  //Handle the error state
  if (error) return <div>Failed to load</div>;
  //Handle the loading state
  if (!data) return <div>Loading...</div>;
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file

  let items = JSON.parse(data);

  items = items.filter((item) => {
    
    let shouldShow = (item.data.description != '...' && 
        item.data.description != '' && 
        item.data.description != null
    );

    if (descriptionValue != '') {
        const words = removeAccents(descriptionValue).split('&&');

        shouldShow = words.every((word) =>
            removeAccents(item.data.description)
                .replace( /(<([^>]+)>)/ig, '')
                .toLowerCase()
                .includes(removeAccents(word.trim()))
        );
    }

    if (nameValue != '') {
        shouldShow = shouldShow && removeAccents(item.jname).toLowerCase().includes(removeAccents(nameValue));
    }

    if (typeValue != '') {
        shouldShow = shouldShow && item.type == typeValue;
    }

    if (slotValue != '') {
        shouldShow = shouldShow && item.slot == slotValue;
    }

    return shouldShow;

  });

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto' }}>

        <div style={{width: '100%', margin: '50px 0', display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '400px'}}>
                <div>
                    Name: <input type="text" onChange={debouncedChangeName} style={{width: '100%', marginBottom: '15px'}} /> 
                </div>
                <div>
                    Type: <input type="text" onChange={debouncedChangeType} style={{width: '100%', marginBottom: '15px'}} />
                </div>
                <div>
                    Description: <input type="text" onChange={debouncedChangeDescription} style={{width: '100%', marginBottom: '15px'}} /> 
                </div>

                <div>
                    Slots: <input type="text" onChange={debouncedChangeSlot} style={{width: '100%', marginBottom: '15px'}} />
                </div>
            </div>
        </div>

        <div>Total: ({items.length})</div>


      <ul style={{ listStyle: 'none', padding: '0' }}>
        {items.map((item) => (
          <li key={item.nameid} style={{  margin: '15px 0', paddingBottom: '15px', borderBottom: '1px solid #ccc' }}>
            <div style={{ marginBottom: '15px'}}>
                <a href={`https://ragnatales.com.br/db/items/${item.nameid}`} target='_blank'>{item.jname} [{item.slot}] - {item.nameid}</a>
            </div>
            <div dangerouslySetInnerHTML={{ __html: item.data.description }}></div>
          </li>
        ))}
      </ul>
    </div>
  );
}