import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import './App.css';

const INITIAL_STATE= {
  multipleType: [],
  first_name:'', 
  last_name:'', 
  email:'', 
  emailisverified: false, 
  activate: false, 
  groups:'',
  aasdasd: false,
  selecttype: '',
}

const OPTIONS = {
  multipleType: ['optionx', 'optiony'],
  selecttype: ['optionx', 'optiony']
}

console.log(Object.keys(INITIAL_STATE))
function App() {
  const [state, setState] = React.useState(INITIAL_STATE)
  const [logList, setLogs] = React.useState([])

  return (
    <div className="App">
      {Object.keys(INITIAL_STATE).map((name) => {
        if (['multipleType'].includes(name)) {
          const stateValues = _.castArray(state[name])
          return (
            <div key={name}>
              <p>{name}</p>              
              {OPTIONS[name].map((option) => {
                return (
                  <div key={option}>
                    <input 
                      type="checkbox" 
                      id={option} 
                      name={option} 
                      checked={stateValues.includes(option)}
                      onChange={(event) => {
                        const { checked } = event.target
                        setState({
                          ...state,
                          [name]: checked
                            ? [...stateValues, option] 
                            : stateValues.filter((item) => item !== option)
                        })
                      }}
                    
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                )
              })}       
            </div>
          )
        }


         if (['selecttype'].includes(name)) {
          return (
            <div  key={name}>
              <select 
                id={name}                   
                value={state[name]}
                onChange={(event) => {
                  const { value } = event.target
                  setState({
                    ...state,
                    [name]: value
                  })
                }}
              >
                <option  value=''>{''}</option>
                {OPTIONS[name].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
                <label htmlFor={name}>{name}</label>
              </div>
          )
      }



        if (['activate','aasdasd'].includes(name)) {
            return (
              <div  key={name}>
                <input 
                  type="checkbox" 
                  id={name}                   
                  checked={!!state[name]}
                  onChange={(event) => {
                    const { checked } = event.target
                    setState({
                      ...state,
                      [name]: checked
                    })
                  }}
                />
                  <label htmlFor={name}>{name}</label>
                </div>
            )
        }

        if (['emailisverified'].includes(name)) {
          return (
            <CheckboxComponent
            key={name}
              name={name}
              value ={!!state[name]}
              onChange={(event) => {
                const { checked } = event.target
                setState({
                  ...state,
                  [name]: checked
                })
              }}
            />
            
          )
      }

        return (
          <div key={name}>
            <label htmlFor={name}>
              {name}
            </label>
            <input
              id={name}
              value={state[name]}
              onChange={(event) => {
                const { value } = event.target
                setState({
                  ...state,
                  [name]: value
                })
              }}
            />
          </div>
        )
      })}
      <button
        onClick={async () => {
            const url = 'https://hudea.okta.com/api/v1/logs?since=2021-05-12'
            const headers = {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': `SSWS 005MYmfA0MJFVUs8i4HOPG8fryK7cdnjqKXvmcd2Hv`
            }
          
            let nextLink = null
            let logs = []
          
            try {
              let response = await axios.get(url, {headers: headers})
              logs.push(...response.data)
              const okta_resp_headers_link = response.headers.link
              const links = _.chain(okta_resp_headers_link).split(',').map(link => {
                return {
                    ref: link.split(';')[1].replace(/rel="(.*)"/, '$1').trim(),
                    url: link.split(';')[0].replace(/<(.*)>/, '$1').trim(),
                }
              }).keyBy('ref').mapValues('url').value()
              nextLink = links['next']
              console.log('BLOCK#1 '+nextLink)
              while (nextLink !== undefined || nextLink !== '') {
                let response = await axios.get(nextLink, {headers: headers})
                logs.push(...response.data)
                const okta_resp_headers_link = response.headers.link
                const links = _.chain(okta_resp_headers_link).split(',').map(link => {
                    return {
                        ref: link.split(';')[1].replace(/rel="(.*)"/, '$1').trim(),
                        url: link.split(';')[0].replace(/<(.*)>/, '$1').trim(),
                    }
                }).keyBy('ref').mapValues('url').value()
                logs.push(...response.data)
                nextLink = links['next']
              }
            } catch (error) {
                console.error(error)
            }
            console.log(state)
            setLogs(logs)
        }}
      >
        submit
      </button>

      {logList.map((log) => {
        const id = JSON.stringify(log)
        return (
          <div key={id}>
            {id}
          </div>
        )
      })}
    </div>
  );
}




function CheckboxComponent({ name, value, onChange }) {

  return (
        <div>
          asdasdfgh
          <input 
            type="checkbox" 
            id={name}                   
            checked={!!value}
            onChange={onChange}
          />
            <label htmlFor={name}>{name}</label>
          </div>
      )

  
}

export default App;
