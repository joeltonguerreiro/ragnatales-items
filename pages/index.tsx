//useSWR allows the use of SWR inside function components
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

type Item = {
  nameid: number, 
    jname: string, 
    description: string, 
    type: string, slot: string
};

export default function Index() {

  const [items, setItems] = useState([] as Item[]);
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

  const handleFilter = async (name: string, description: string, type: string, slot: string) => {
    try {
      let params = new URLSearchParams({ name: name, description: description, type: type, slot: slot });

      const response = await fetch(`/api/items?`+params);

      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
        // Handle the filtered product data here
        console.log("Filtered product:", data);
      } else {
        // Handle errors
        console.error("Error filtering products:", response.status);
      }
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  useEffect(() => {
    handleFilter(nameValue, descriptionValue, typeValue, slotValue);
  }, [nameValue, descriptionValue, typeValue, slotValue]);

  //Handle the error state
  // if (error) return <div>Failed to load</div>;
  // //Handle the loading state
  if (!items) return <div>No items to show</div>;
  // console.log('length', data.items.length);

  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file

  // let items = JSON.parse(data);

  // console.log(props.items);

  // let filtered = props.items.filter((item) => {
    
  //   let shouldShow = (item.description != '...' && 
  //       item.description != '' && 
  //       item.description != null
  //   );

  //   if (descriptionValue != '') {
  //       const words = removeAccents(descriptionValue).split('&&');

  //       shouldShow = words.every((word) =>
  //           removeAccents(item.description)
  //               .replace( /(<([^>]+)>)/ig, '')
  //               .toLowerCase()
  //               .includes(removeAccents(word.trim()))
  //       );
  //   }

  //   if (nameValue != '') {
  //       shouldShow = shouldShow && removeAccents(item.jname).toLowerCase().includes(removeAccents(nameValue));
  //   }

  //   if (typeValue != '') {
  //       shouldShow = shouldShow && item.type == typeValue;
  //   }

  //   if (slotValue != '') {
  //       shouldShow = shouldShow && item.slot == slotValue;
  //   }

  //   return shouldShow;

  // });

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto' }}>

        <div style={{width: '100%', margin: '50px 0', display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '400px'}}>
                <div>
                    Nome: <input type="text" onChange={debouncedChangeName} style={{width: '100%', marginBottom: '15px'}} /> 
                </div>
                <div>
                    Tipo: <input type="text" onChange={debouncedChangeType} style={{width: '100%', marginBottom: '15px'}} />
                </div>
                <div>
                    Descrição: <input type="text" onChange={debouncedChangeDescription} style={{width: '100%', marginBottom: '15px'}} /> 
                </div>

                <div>
                    Slots: <input type="text" onChange={debouncedChangeSlot} style={{width: '100%', marginBottom: '15px'}} />
                </div>
            </div>
        </div>

        <div>Total: ({items.length})</div>


      <ul style={{ listStyle: 'none', padding: '0' }}>
        {items.map((item) => (
          <li key={item?.nameid} style={{  margin: '15px 0', paddingBottom: '15px', borderBottom: '1px solid #ccc' }}>
            <div style={{ marginBottom: '15px'}}>
                <a href={`https://ragnatales.com.br/db/items/${item.nameid}`} target='_blank'>{item.jname} [{item.slot}] - {item.nameid}</a>
            </div>
            <label htmlFor="description">Descrição:</label>
            <div dangerouslySetInnerHTML={{ __html: item?.description }}></div>
          </li>
        ))}
      </ul>
    </div>
  );
}