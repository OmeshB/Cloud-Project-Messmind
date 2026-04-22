provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "messmind-rg"
  location = "Central India"
}