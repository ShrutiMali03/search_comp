import React, { Component } from 'react';
import {map,values} from 'lodash';
import SearchInput, {createFilter} from 'react-search-input';
const KEYS_TO_FILTERS = ['name', 'id', 'sources','emails','phones','sources','created_at','updated_at']

export default class App extends Component {
	
constructor(props) {
    super(props)
    this.state = {
        searchTerm: '',
        extractData: [],
        sortedList: [],
        previousScroll: 0,
        startIndex: 1

    }
    this.searchUpdated = this.searchUpdated.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
}

componentWillMount() {
    var sortedList = map(data.clients, function(client) {
        var sortedItem = {};
        for (var property in client) {
            if (client.hasOwnProperty(property)) {
                if (Array.isArray(client[property])) {
                    if (property !== 'sources') {
                        client[property] = map(client[property][0], function(el) {
                            return el
                        });
                        client[property].pop();
                    }
                    sortedItem[property] = (client[property]).join(":");
                } else {
                    sortedItem[property] = client[property];
                }
            }
        }
        return sortedItem;
    })
    let indexValue = this.state.startIndex;
    let extractData = sortedList.slice(indexValue, indexValue + 14);
    this.setState(Object.assign({}, this.state, {
        extractData: extractData,
        sortedList: sortedList,
        startIndex: indexValue + 14
    }))
}

componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
}

searchUpdated(term) {
    this.setState({
        searchTerm: term
    })
}

handleScroll() {
    var scrollDirection,
        currentScroll = window.scrollY,
        innerHeight = window.innerHeight;
    if ((currentScroll >= this.state.previousScroll) && ((document.scrollingElement.scrollTop + innerHeight) >= document.scrollingElement.scrollHeight)) {
        let indexValue = this.state.startIndex;
        indexValue = indexValue === data.clients.length ? indexValue - 15 : this.state.startIndex;
        let extractData = this.state.sortedList.slice(indexValue, indexValue + 15);
        this.setState(Object.assign({}, this.state, {
            extractData: extractData,
            previousScroll: currentScroll,
            startIndex: indexValue + 15
        }))
    } else if (document.scrollingElement.scrollTop === 0) {
        let indexValue = this.state.startIndex
        indexValue = indexValue === 15 ? indexValue + 15 : this.state.startIndex;
        let extractData = this.state.sortedList.slice(indexValue - 30, indexValue - 15);
        this.setState(Object.assign({}, this.state, {
            extractData: extractData,
            previousScroll: currentScroll,
            startIndex: indexValue - 15
        }))
    }

}

  render() {
  	const filteredEmails = this.state.extractData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
  	return (
      <div className="main-body">
      <SearchInput className="search-input" onChange={this.searchUpdated} />
      <div className="table-scroll" onScroll={this.handleScroll}>
      <table className="table">
      	<thead>
      		<tr>
      			<th>Id</th>
      			<th>Name</th>
      			<th>Email</th>
      			<th>Phone</th>
      			<th>Sources</th>
      			<th>Created</th>
      			<th>Updated</th>
     		 </tr>
     	 </thead>
     	 <tbody>
      {filteredEmails.map(client => {
          return (
            <tr key={client.id}>
            	<td>{client.id}</td>
            	<td>{client.name}</td>
            	<td>{client.emails}</td>
            	<td>{client.phones}</td>
            	<td>{client.sources}</td>
            	<td>{client.created_at}</td>
            	<td>{client.updated_at}</td>
            </tr>
          )
        })}
      	</tbody>
      </table>
      </div>
      </div>
    );
  }
}
