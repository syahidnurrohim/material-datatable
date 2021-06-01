/**
    Material Table, preact/react table builder    
    Copyright (C) 2021 https://github.com/syahidnurrohim

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 **/

/** Checkpoint
    - How to make filter, search, set, and get data are in one single flow, get rid of it's branch flow
    Here's how the algorithm works for set data
    - Check for filter, search, order property
      - If filter propery is'nt empty then call 
      -> serverside: Call from the server
      -> clientside: assign from options.data

**/

import { className as cn, classNameGroup as cng, style } from './constants'
import './style.css'

var MaterialTable = (function () {
  function MTB(target, options) {
    this.options = {
      rowsPerPage: [10, 20, 40],
      style: {},
      order: [[0, 'desc']],
      data: []
    }
    this.data = []
    this.target = target
    this.targetElement = null
    this.tableWrapper = null
    this.tablePagination = null
    this.pageIndex = 0
    this.rowBound = this.options.rowsPerPage[0]
    this.start = 0
    this.end = this.rowBound
    this.totalData = 0
    this.search = ''
    this.filter = {}

    this.rowsDropdown = this.rowsDropdown.bind(this)
    this.changeRowPerPage = this.changeRowPerPage.bind(this)
    this.searchData = this.searchData.bind(this)
    this.extend(this.options, options)
    
  }

  MTB.prototype.init = function () {
    this.buildContainer()
    this.buildHeader()
    this._callFn('buildWithData', function () {
      this.buildRow()
      this.buildFooter()
    })
  }

  MTB.prototype.extend = function (dst, src) {
    for (const key in src) {
      const d = dst[key]
      if (d !== null && typeof d === 'object' && !Array.isArray(d)) {
        this.extend(d, src[key])
      } else {
        dst[key] = src[key]
      }
    }
    return dst
  }

  MTB.prototype.sendBuildingMessage = function () {
    const tbody = this.targetElement.querySelector('tbody') 
    tbody.innerHTML = ''
    tbody.append(this.buildNode({
      el: 'tr',
      class: cn.MDCRow,
      child: [{
        el: 'td',
        class: cn.MDCCell,
        style: {textAlign: 'center'},
        colspan: this.options.columns.length,
        child: 'Wait for loading data...'
      }]
    }))
  }
  
  MTB.prototype.isFunc = function (object) {
    return object && typeof object === 'function';
  }

  MTB.prototype.buildWithData_CS = function (callback) {
    this.sendBuildingMessage()
    this.setData(this.getData_CS())
    callback.bind(this)()
  }

  MTB.prototype.buildWithData_SS = function (callback) {
    callback = callback.bind(this)
    callback()
  }

  MTB.prototype.getData_CS = function () {
    const data = this.options.data
    const filteredData = this.filterFn(data)
    this.totalData = data.length
    this.setDataBoundary()

    return filteredData.slice(this.start, this.end)
  }

  MTB.prototype.getData_SS = function () {
    return this.options.data
  }

  MTB.prototype.setDataBoundary = function () {
    var end = this.rowBound * (this.pageIndex + 1)
    this.end = end > this.totalData ? this.totalData : end
    this.start = this.pageIndex * this.rowBound
  }
  
  MTB.prototype.setData = function (data) {
    this.data = data
  }

  MTB.prototype._callFn = function (target) {
    const fname = target + (this.options.serverSide ? '_SS' : '_CS')
    const args = []
    for (let i = 0; i < arguments.length; i++) (i !== 0) && args.push(arguments[i])
    this[fname].apply(this, args)
  }

  MTB.prototype.filterFn = function (data) {
    const _this = this
    return data.filter(function (d) {
      let passed = false;
      _this.options.columns.forEach(function (c) {
        let matcher = ''
        if (d[c.data] === null || d[c.data] === undefined) return false
        if (typeof d[c.data] === 'string') {
          matcher = d[c.data]
        } else {
          matcher = d[c.data].toString()
        }
        if (matcher.toLowerCase().match(_this.search.toLowerCase()) !== null) {
          passed = true
        }
        if (passed) return false
      })
      return passed
    })
  }

  MTB.prototype.searchData = function () {
    const _this = this
    let timeout;
    function searchData(e) {
      if ((((e.which < 65 && !(e.which >= 48 || e.which <= 57)) && e.which != 32 && e.which != 8) || e.which > 90 ) || e.ctrlKey) {
        return false;
      }
      _this.search = e.target.value
      _this._callFn('buildWithData', function() {
        this.buildRow()
        this.buildFooter({replace: true})
      })
    }
    return function (e) {
      clearTimeout(timeout)
      timeout = setTimeout(() => searchData(e), 250)
    }
  }

  MTB.prototype.buildContainer = function () {
    const target = document.querySelector(this.target)
    const tbody = target.querySelector('tbody')
    this.targetElement = target.cloneNode(true)
    const node = this.buildNode({
      el: 'div',
      class: cn.MDCWrapper,
      style: this.options.style,
      child: [{el: 'div', class: cn.MDCTableContainer, child: this.targetElement}]
    })
    const search = this.buildNode({
      el: 'div',
      style: style.searchWrapper,
      child: [{
        el: 'input', 
        type: 'text', 
        style: style.searchInput, 
        placeholder: 'Search here...', 
        events: {keydown: this.searchData()}, 
        withoutChild: true
      }]
    })

    if (tbody == null) {
      this.targetElement.append(this.buildNode({
        el: 'tbody',
        class: cn.MDCContent,
        withoutChild: true
      }))
    }

    node.prepend(search)
    this.targetElement.classList.add(cn.MDCTable)
    this.tableWrapper = node

    target.parentElement.replaceChild(node, target)
  }

  MTB.prototype.buildHeader = function () {
    const _this = this
    const header = this.targetElement.querySelector('thead')
    const headerRows = header.querySelectorAll('tr')

    const headerCellsLoop = function (cell, iCell) {
      _this.extend(cell.style, {fontWeight: '600', opacity: '0.9'})
      cell.classList.add(cn.MDCHeaderCell)
      if (_this.options.columns[iCell].numeric) {
        cell.classList.add(cn.MDCHeaderCellNumeric)
      }
    }

    headerRows.forEach((row, i) => {
      if (i !== 0) {
        row.style.borderTop = '1px solid rgba(0,0,0,0.1)'
      }
      row.classList.add(cn.MDCHeaderRow)
      row.querySelectorAll('th').forEach(headerCellsLoop)
    })

  }

  MTB.prototype.buildRow = function () {
    const _this = this
    const body = this.targetElement.querySelector('tbody')
    body.innerHTML = ''

    const createCell = function (data, options) {
      var classes = [cn.MDCCell]
      if (options.numeric) {
        classes.push(cn.MDCCellNumeric)
      }
      return _this.buildNode({el: 'td', class: classes, child: data})
    }

    this.data.forEach(function (data, index) {
      const row = _this.buildNode({el: 'tr', class: cn.MDCRow, withoutChild: true})
      row.classList.add(cn.MDCRow)

      _this.options.columns.forEach((col, iCell) => {
        const options = {
          numeric: col.numeric
        }

        if (_this.isFunc(col.render)) {
          row.append(createCell(col.render(row, data, index), options))
        } else {
          row.append(createCell(data[col.data], options))
        }

        if (_this.isFunc(_this.options.createdCell)) {
          _this.options.createdCell(data, col, index, iCell)
        }
      })

      body.append(row)

      if (_this.isFunc(_this.options.createdRow)) {
        _this.options.createdRow(row, data, index)
      }
    })
  }

  MTB.prototype.rowsDropdown = function (e) {
    this.rowsDropdownTrigger('show')
  }

  MTB.prototype.rowsDropdownTrigger = function (e) {
    const dw = this.tableWrapper.querySelector('.' + cn.MDCSelectMenu)
    dw.style.display = e === 'show' ? 'block' : 'none'
    dw.style.opacity = e === 'show' ? 1 : 0
  } 

  MTB.prototype.changeRowPerPage = function (e) {
    this.rowsDropdownTrigger('hide')
    this.rowBound = e.target.dataset.row
    this.pageIndex = 0
    this._callFn('buildWithData', function () {
      this.buildRow()
      this.buildFooter({replace: true})
    })
  }
  
  MTB.prototype.buildFooter = function (options = {}) {
    const _this = this
    const rowsPerPageList = this.options.rowsPerPage.map(rows => ({
      el: 'li',
      class: [cn.MDCLi].concat(rows == _this.rowBound ? cn.MDCLiSelected : ''),
      data: {row: rows},
      events: { click: this.changeRowPerPage },
      child: [{
        el: 'span',
        data: {row: rows},
        class: cn.MDCLiText,
        child: rows
      }]
    }))
    const s = {el: 'div', class: cn.MDCPagination, style: style.paginationWrapper, child: [
      {el: 'div', class: cn.MDCPaginationTrailing, child: [
        {el: 'div', class: cn.MDCPaginationRPP, child: [
          {el: 'div', class: cn.MDCPaginationRPPLabel, child: 'Rows per page'},
          {el: 'div', class: cng.selectRPPGroup, child: [
            {el: 'div', class: cn.MDCSelectAnchor, style: style.selectAnchor, events: { click: this.rowsDropdown }, child: [
              {el: 'span', class: cn.MDCSelectedTextContainer, child: [
                {el: 'span', class: cn.MDCSelectedText, child: this.rowBound}
              ]},
              {el: 'span', class: cn.MDCSelectDropdownIcon, child: []},
              {el: 'span', class: cng.spanNotchedGroup, child: [
                {el: 'span', class: cn.MDCNotchedOutlineLeading, child: []},
                {el: 'span', class: cn.MDCNotchedOutlineTrailing, child: []},
              ]},
            ]},
            {el: 'div', class: cng.selectRPPMenuGroup, child: [
              {el: 'ul', class: cn.MDCList, child: rowsPerPageList}
            ]}
          ]}
        ]},
        {el: 'div', class: cn.MDCPaginationNavigation, child: [
          {el: 'div', class: cn.MDCPaginationNavigationTotal, child: _this.start + '-' + _this.end + ' of ' + _this.totalData},
          {el: 'button', disabled: this.pageIndex === 0, class: cng.footNavigationGroup, child: [
            {el: 'div', class: cn.MDCButtonIcon, child: 'first_page'}
          ], events: {click: e => this.navigation('firstPage', e)}},
          {el: 'button', disabled: this.pageIndex === 0, class: cng.footNavigationGroup, child: [
            {el: 'div', class: cn.MDCButtonIcon, child: 'chevron_left'}
          ], events: {click: e => this.navigation('prevPage', e)}},
          {el: 'button', disabled: (this.pageIndex + 1) === Math.ceil(this.totalData / this.rowBound), class: cng.footNavigationGroup, child: [
            {el: 'div', class: cn.MDCButtonIcon, child: 'chevron_right'}
          ], events: {click: e => this.navigation('nextPage', e)}},
          {el: 'button', disabled: (this.pageIndex + 1) === Math.ceil(this.totalData / this.rowBound), class: cng.footNavigationGroup, child: [
            {el: 'div', class: cn.MDCButtonIcon, child: 'last_page'}
          ], events: {click: e => this.navigation('lastPage', e)}},
        ]}
      ]}
    ]}

    const node = this.buildNode(s)

    if (options.replace) {
      this.tableWrapper.replaceChild(node, this.tablePagination)
    } else {
      this.tableWrapper.append(node)
    }
    this.tablePagination = node
  }

  MTB.prototype.navigation = function (dir, e) {
    switch (dir) {
      case 'firstPage':
        this.pageIndex = 0
        break;
      case 'prevPage':
        this.pageIndex--
        break;
      case 'nextPage':
        this.pageIndex++
        break;
      case 'lastPage':
        this.pageIndex = Math.ceil(this.totalData / this.rowBound) - 1
        break;
    }
    this._callFn('buildWithData', function () {
      this.buildRow()
      this.buildFooter({replace: true})
    })
  } 

  MTB.prototype.buildNode = function (s) {
    const el = document.createElement(s.el)

    for (const opt in s) {
      switch (opt) {
        case 'class':
          if (Array.isArray(s.class)) {
            el.classList.add.apply(el.classList, s.class.filter(c => typeof c === 'string' && c !== ''))
          } else {
            el.classList.add(s.class)
          }
          break;
        case 'style': Object.assign(el.style, s.style); break;
        case 'events':
          for (const event in s.events) {
            el.addEventListener(event, s.events[event], true)
          }
          break;
        case 'data':
          for (const data in s.data) {
            el.setAttribute('data-'+data, s.data[data])
          }
          break;
        case 'disabled': el[opt] = s[opt]; break;
        case 'withoutChild': return el
        case 'child': case 'el': break;
        default:
          el.setAttribute(opt, s[opt])
          break;
      }
    }

    if (Array.isArray(s.child)) {
      this.appendStructuredElement(el, s.child)
    } else if (s.child instanceof Node) {
      el.appendChild(s.child)
    } else {
      el.innerHTML = s.child
    }

    return el
  }

  MTB.prototype.appendStructuredElement = function (target, structure) {
    const nodes = structure.map(s => this.buildNode(s))
    target.append.apply(target, nodes)
  }

  return MTB
})()

export { MaterialTable }