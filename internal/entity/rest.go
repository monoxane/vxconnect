package entity

type RESTError struct {
	StatusCode int    `json:"code"`
	Message    string `json:"message"`
	Error      string `json:"error"`
}

type RESTResult struct {
	Results      interface{} `json:"results"`
	TotalResults int         `json:"total_results"`
}
