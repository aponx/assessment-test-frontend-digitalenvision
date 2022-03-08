import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import Config from "../../../config";
import querystring from 'query-string';
import axios from 'axios';

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      token: "",
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  componentDidMount() {
    const headers = {
      headers: {
        'Authorization': 'Basic ' + (new Buffer(Config.api.clientId + ':' + Config.api.clientSecret).toString('base64')),
        "Content-Type": "application/x-www-form-urlencoded",
      }
    };
    
    let data = {
      grant_type: "client_credentials"
    };

    axios
      .post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify(data),
        headers
      )
      .then((response) => {
        this.setState({
          token: response.data.token_type+" "+response.data.access_token
        });
        this.newReleasesFunc();
        this.playlistsFunc();
        this.categoriesFunc();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  newReleasesFunc() {
    const headers = {
      headers: {
        'Authorization': this.state.token,
        "Content-Type": "application/json",
      }
    };

    axios
      .get(
        Config.api.baseUrl+"/browse/new-releases",
        headers
      )
      .then((response) => {
        var data = response.data;
        this.setState({
          newReleases: data.albums.items
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  playlistsFunc() {
    const headers = {
      headers: {
        'Authorization': this.state.token,
        "Content-Type": "application/json",
      }
    };

    axios
      .get(
        Config.api.baseUrl+"/browse/featured-playlists",
        headers
      )
      .then((response) => {
        var data = response.data;
        this.setState({
          playlists: data.playlists.items
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  categoriesFunc() {
    const headers = {
      headers: {
        'Authorization': this.state.token,
        "Content-Type": "application/json",
      }
    };

    axios
      .get(
        Config.api.baseUrl+"/browse/categories",
        headers
      )
      .then((response) => {
        var data = response.data;
        this.setState({
          categories: data.categories.items
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
