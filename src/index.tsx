import './styles/index.scss';
import { File } from './types/IndexTypes';

import * as moment from 'moment';
import * as React from "react";
import { render } from "react-dom";

interface IMenuProps {
}

interface IMenuState {
  files: File[];
}

class MenuPage extends React.Component<IMenuProps, IMenuState> {
  constructor(props: IMenuProps) {
    super(props);

    this.state = {
      files: []
    }

    this.renderTableCell = this.renderTableCell.bind(this);
    this.getFiles = this.getFiles.bind(this);
  }

  componentDidMount() {
    this.getFiles('http://localhost:8080/api/files');
  }

  async getFiles(url: string) {
    let response = await fetch(url);
    const files = await response.json();
    this.setState({ files: files });
  }

  handleRowClick(href: string) {
    window.location.href = href;
  }

  renderTableCell() {
    return (
      this.state.files.map((file, index) =>
        <tr key={`tableRow${index}`} onClick={() => this.handleRowClick(file.href)}>
          <td key={`rowGroup${index}`} className="has-text-centered">{file.group}</td>
          <td key={`rowTitle${index}`} className="has-text-centered">{file.title}</td>
          <td key={`rowVenue${index}`} className="has-text-centered">{file.venue}</td>
          <td key={`rowDate${index}`} className="has-text-centered">{moment(file.presented).format("YYYY-MM-DD")}</td>
          <td key={`rowAuthor${index}`} className="has-text-centered">{file.author}</td>
          <td key={`rowSize${index}`} className="has-text-centered">{file.size}</td>
        </tr>
      )
    )
  }

  render() {
    return (
      <>
        <thead>
          <tr>
            <th className="has-text-centered">Topic</th>
            <th className="has-text-centered">Title</th>
            <th className="has-text-centered">Venue</th>
            <th className="has-text-centered">Presented</th>
            <th className="has-text-centered">Author</th>
            <th className="has-text-centered">Size</th>
          </tr>
        </thead>
        <tbody>{this.renderTableCell()}</tbody>
      </>
    )
  }
}

render(
  <MenuPage />,
  document.getElementById("mainTable")
)