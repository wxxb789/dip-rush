# DIP-Rush Project TODO List

## Long-term Planning Items

- [ ] refactor the code, make it more structured and clean. do not write everything in one .tsx file.
- [ ] reveiw the code, think deeply of data type driven design, make the code more robust and less error-prone. reduce the use of `any` type. reduce the redundant code.
- [ ] use a better practice for i18n, use a better library or write a better one. rather than wite different translation in every .tsx file. looks stupid.
- [ ] add more pre-set assets
- [ ] resovle the issue that aktools api use `stock_us_spot_em` field rather than a normal `symbol` field
  - [ ] should build a mapping table to map the `stock_us_spot_em` to `symbol`
- [ ] fix UI issue that all the other elements are hideden after click any dropdown menu
- [ ] UI looks bad, need to design a much nice look
- [ ] make it cloudfalre ready. CI/CD pipeline.

### User Experience Enhancements

- [ ] Advanced filtering capabilities
  - Pattern-based filtering
  - Custom indicator combinations
  - Save favorite filter configurations
- [ ] Real-time data updates
  - WebSocket integration, is it necessary?
  - Auto-refresh configuration
  - Data staleness indicators

### Technical Improvements

- [ ] Performance Optimization
  - Data caching layer
  - Lazy loading for large datasets
  - Virtual scrolling for data tables
- [ ] Testing Infrastructure
  - Unit test coverage
  - Integration test suite
  - E2E test framework
- [ ] Error Handling
  - Global error boundary
  - Error reporting system
  - Retry mechanisms for failed requests

### Feature Additions

- [ ] Portfolio Management
  - Portfolio tracking
  - Performance analytics
  - Position sizing calculator
- [ ] Advanced Analytics
  - Custom indicator creation
  - Multi-timeframe analysis
  - Correlation studies
- [ ] Data Export
  - Multiple format support (CSV, JSON)
  - Customizable export templates
  - Scheduled exports

### Infrastructure

- [ ] Monitoring and Analytics
  - User behavior tracking
  - Performance metrics
  - Error tracking
- [ ] DevOps
  - CI/CD pipeline
  - Automated testing
  - Deployment automation

### Documentation

- [ ] API Documentation
  - Endpoint documentation
  - Integration guides
  - API versioning strategy
- [ ] User Guides
  - Feature walkthroughs
  - Best practices
  - Troubleshooting guides

## Notes

- Each item will be broken down into smaller, manageable tasks
- Priority and dependencies will be determined during breakdown phase
- Items can be moved to progress.md once they are ready for implementation
