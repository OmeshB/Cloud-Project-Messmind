provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "messmind-rg-2"   # 👈 CHANGE THIS
  location = "Central India"
}