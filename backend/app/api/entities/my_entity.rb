module API
  module Entities
    class MyEntity < Grape::Entity
      expose :id, documentation: { type: 'Integer', desc: 'ID of the entity' }
      # ... further code ...
    end
  end
end