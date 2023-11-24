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

  // return (
  //   <div className="p-10">
  //     <button className="btn btn-primary">Button</button>
  //   </div>
  // )

  const [items, setItems] = useState([] as Item[]);
  const [descriptionValue, setDescriptionValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [typeValue, setTypeValue] = useState('');
  const [slotValue, setSlotValue] = useState('');
  const [subtypeValue, setSubtypeValue] = useState('');

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

  const handleChangeSubType = (e) => {
    setSubtypeValue(e.target.value);
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

  const debouncedChangeSubType = useMemo(
    () => debounce(handleChangeSubType, 500),
    [subtypeValue]
  )

  const handleFilter = async (name: string, description: string, type: string, slot: string, subType: string) => {
    try {
      let params = new URLSearchParams({ 
        name: name, 
        description: description, 
        type: type, 
        slot: slot, 
        subtype: subType
      });

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
    handleFilter(nameValue, descriptionValue, typeValue, slotValue, subtypeValue);
  }, [nameValue, descriptionValue, typeValue, slotValue, subtypeValue]);

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
    <div className="container mx-auto">

        <div className="flex justify-center text-3xl font-bold py-10">Ragnatales Items Search</div>

        <div className="flex justify-center">
            <div className='w-1/3'>
                <div className="form-control">
                  <div className="label">Nome:</div>
                    <input type="text" className="input input-bordered w-full max-w-lg" onChange={debouncedChangeName} /> 
                </div>
                <div className="form-control">
                    <div className="label">Tipo:</div> 
                    <select name="type" id="" className="select select-bordered w-full max-w-lg" onChange={debouncedChangeType}>
                        <option value="all">Todos</option>
                        <option value="4">Armas</option>
                        <option value="5">Equipamentos</option>
                        <option value="6">Cartas</option>
                        <option value="18">Consumiveis</option>
                        <option value="8">Pet</option>
                        <option value="10">Munições</option>
                    </select>
                </div>

              <div>
                {typeValue == '5' && 
                    <div className="form-control">
                      <div className="label">SubTipo:</div>
                      <select name="type" id="" className="select select-bordered w-full max-w-lg" onChange={debouncedChangeSubType}>
                        <option value="all">Todos</option>
                        <option value="head">Cabeça</option>
                        <option value="body">Corpo</option>
                    </select>
                    </div>
                }
              </div>

                <div className="form-control">
                    <div className="label">Descricão:</div>
                    <textarea name="description" className="textarea textarea-bordered w-full max-w-lg" onChange={debouncedChangeDescription} /> 
                </div>

                <div className="form-control">
                    <div className="label">Slot:</div>
                    <select name="type" id="" className="select select-bordered w-full max-w-lg" onChange={debouncedChangeSlot}>
                        <option value="all">Todos</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="flex justify-center my-10 pb-10">
          Total: ({items.length})
        </div>


        <ul className="list-none">
          {items.length && items.map((item) => (
            <li key={item?.nameid} className="pb-8 flex justify-center">
              <div className="card card-bordered w-1/2 bg-gray-200 text-base-content">
                <div className="card-body">
                  <div className="card-title">
                      <a href={`https://ragnatales.com.br/db/items/${item.nameid}`} target='_blank'>{item.jname} [{item.slot}] - {item.nameid}</a>
                  </div>

                  <div>
                    <label htmlFor="description">Descrição:</label>
                  </div>

                  <div dangerouslySetInnerHTML={{ __html: item?.description }}></div>
                </div>
              </div>
            </li>
          )) || <div className="flex justify-center text-3xl pb-10">Nenhum item encontrado</div>}
        </ul>
    </div>
  );
}