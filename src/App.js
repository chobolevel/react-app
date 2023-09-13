import logo from './logo.svg';
import { useState } from 'react';

function Header(props) {
  return (
    <header>
      <h1>
        <a href="/" onClick={(e) => {
          e.preventDefault()
          props.onChangeMode()
        }}>{props.title}</a>
      </h1>
    </header>
  )
}

function Nav(props) {
  const lis = []
  for(let i = 0; i < props.topics.length; i++) {
    const t = props.topics[i]
    // 이렇게 반복적으로 태그를 생성하면 해당 각 태그를 추적하기 위함
    // key값은 반복문 안에서만 중복되지 않으면 됨
    lis.push(<li key={t.id}>
      <a id={t.id} href={`/read/${t.id}`} onClick={(e) => {
        e.preventDefault()
        props.onChangeMode(e.target.id)
      }}>{t.title}</a>
    </li>)
  }
  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  )
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  )
}

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={(e) => {
        e.preventDefault()
        const title = e.target.title.value
        const body = e.target.body.value
        props.onCreate(title, body)
      }}>
        <div>
          <input type="text" name="title" placeholder="title"/>
        </div>
        <div>
          <textarea name="body" placeholder="body"/>
        </div>
        <div>
          <input type="submit" value="Create"/>
        </div>
      </form>
    </article>
  )
}

function Update(props) {
  const [title, setTitle] = useState(props.title)
  const [body, setBody] = useState(props.body)
  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={(e) => {
        e.preventDefault()
        const title = e.target.title.value
        const body = e.target.body.value
        props.onUpdate(title, body)
      }}>
      <div>
          <input type="text" name="title" placeholder="title" value={title} onChange={(e) => {
            setTitle(e.target.value)
          }}/>
        </div>
        <div>
          <textarea name="body" placeholder="body" value={body} onChange={(e) => {
            setBody(e.target.value)
          }}/>
        </div>
        <div>
          <input type="submit" value="Update"/>
        </div>
      </form>
    </article>
  )
}

function App() {
  const [mode, setMode] = useState('WELCOME')
  const [id, setId] = useState(null)
  const [nextId, setNextId] = useState(4)
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is ...' },
    { id: 2, title: 'css', body: 'css is ...' },
    { id: 3, title: 'javascript', body: 'javascript is ...' }
  ])
  let content = null
  let contextControl = null
  if(mode === 'WELCOME') {
    content = <Article title='WELCOME' body='Hello, WEB'/>
  } else if(mode === 'READ') {
    const topic = topics.find((t) => t.id === Number(id))
    content = <Article title={topic.title} body={topic.body}/>
    contextControl = <>
      <li>
        <a href={`/update/${topic.id}`} onClick={(e) => {
          e.preventDefault()
          setMode('UPDATE')
        }}>Update</a>
      </li>
      <li>
        <input type="button" value="Delete" onClick={() => {
          setTopics(topics.filter((t) => t.id !== Number(id)))
          setMode('WELCOME')
        }}/>
      </li>
    </>
  } else if(mode === 'CREATE') {
    content = <Create onCreate={(title, body) => {
      const newTopic = { id: nextId, title, body }
      setTopics([...topics, newTopic])
      setMode('READ')
      setId(nextId)
      setNextId(nextId + 1)
    }}/>
  } else if(mode === 'UPDATE') {
    const topic = topics.find((t) => t.id === Number(id))
    content = <Update title={topic.title} body={topic.body} onUpdate={(title, body) => {
      const updatedTopic = {
        id: Number(id),
        title,
        body
      }
      setTopics(topics.map((t) => {
        if(t.id === Number(id)) {
          return updatedTopic
        } else {
          return t
        }
      }))
      setMode('READ')
    }}/>
  }
  return (
    <div>
      <Header title='REACT' onChangeMode={() => setMode('WELCOME')}/>
      <Nav topics={topics} onChangeMode={(topicId) => {
        setMode('READ')
        setId(topicId)
      }}/>
      {content}
      <ul>
        <li>
          <a href="/create" onClick={(e) => {
            e.preventDefault()
            setMode('CREATE')
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
