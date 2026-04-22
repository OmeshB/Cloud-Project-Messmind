provider "azurerm" {
  features {}
}

data "azurerm_resource_group" "rg" {
  name = "messmind-rg"
}